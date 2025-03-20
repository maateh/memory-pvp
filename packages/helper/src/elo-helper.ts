// types
import type { SessionStatus, TableSize } from "@repo/db"
import type {
  ClientSession,
  MultiplayerClientSession,
  SoloClientSession
} from "@repo/schema/session"

// config
import { tableSizeMap } from "@repo/config/game"
import {
  CORRECTED_FLIPS_MULTIPLIER,
  ELO_DIFFERENCE_FACTOR,
  FORCE_CLOSE_SUBTRACT_VALUE,
  K_FACTORS,
  TABLE_SIZE_MULTIPLIERS,
  TIME_BOOSTER_MULTIPLIERS,
  TIME_BOOSTER_LIMITS,
  SOLO_SCORE_MULTIPLIER_SUBTRACTOR
} from "@repo/config/elo"

// helpers
import { currentPlayerKey } from "./player-helper"

type EloUpdate = {
  newElo: number
  gainedElo: number
}

/**
 * Calculates expected ELO score based on two players' ratings.
 * 
 * @param playerElo - Current ELO of the player.
 * @param opponentElo - ELO of the opponent.
 * @returns Expected probability of winning.
 */
function calculateExpectedScore(
  playerElo: number,
  opponentElo: number
): number {
  return 1 / (1 + Math.pow(10, (opponentElo - playerElo) / ELO_DIFFERENCE_FACTOR))
}

type CalculateGainedEloOpts = {
  kFactor: number
  scoreMultiplier: number
  tableSize: TableSize
  timer?: number
}

/**
 * TODO: write doc
 * 
 * @param options
 * @returns 
 */
export function calculateGainedElo(
  options: CalculateGainedEloOpts
): number {
  const { kFactor, scoreMultiplier, tableSize, timer } = options

  const sizeMultiplier = TABLE_SIZE_MULTIPLIERS[tableSize]
  let timeFactor = 1
  
  if (timer) {
    const minTimeMultiplier = TIME_BOOSTER_MULTIPLIERS.MIN
    const maxTimeMultiplier = TIME_BOOSTER_MULTIPLIERS.MAX
    const timeBoosterLimit = TIME_BOOSTER_LIMITS[tableSize]

    timeFactor = Math.max(
      minTimeMultiplier,
      maxTimeMultiplier - timer / (timeBoosterLimit * 2)
    )
  }

  return Math.round(kFactor * scoreMultiplier * sizeMultiplier * timeFactor)
}

/**
 * TODO: write doc
 * 
 * @param flips 
 * @returns 
 */
function correctedFlips(flips: number): number {
  return (flips * CORRECTED_FLIPS_MULTIPLIER) || 1
}

/**
 * TODO: write doc
 * 
 * @param session 
 * @returns 
 */
export function soloElo(
  session: Pick<SoloClientSession, "owner" | "stats" | "tableSize" | "mode">,
  status: Extract<SessionStatus, "FINISHED" | "CLOSED" | "FORCE_CLOSED">
): EloUpdate {
  const { owner, stats, tableSize, mode } = session

  if (mode === "CASUAL") {
    return { newElo: owner.stats.elo, gainedElo: 0 }
  }

  const successRate = status !== "FORCE_CLOSED"
    ? stats.matches[owner.id] / correctedFlips(stats.flips[owner.id])
    : -FORCE_CLOSE_SUBTRACT_VALUE

  const gainedElo = calculateGainedElo({
    kFactor: K_FACTORS.SINGLE,
    scoreMultiplier: successRate - SOLO_SCORE_MULTIPLIER_SUBTRACTOR,
    tableSize,
    timer: stats.timer
  })

  return { newElo: owner.stats.elo + gainedElo, gainedElo }
}

/**
 * TODO: write doc
 * 
 * @param session 
 * @param playerId 
 * @returns 
 */
export function pvpElo(
  session: Pick<MultiplayerClientSession, "owner" | "guest" | "stats" | "tableSize" | "mode">,
  playerId: string,
  status: Extract<SessionStatus, "FINISHED" | "CLOSED" | "FORCE_CLOSED">
): EloUpdate {
  const { owner, guest, stats, tableSize, mode } = session

  const playerKey = currentPlayerKey(owner.id, playerId)
  const player = playerKey === "owner" ? owner : guest
  const opponent = playerKey === "owner" ? guest : owner

  if (mode === "CASUAL") {
    return { newElo: player.stats.elo, gainedElo: 0 }
  }

  const tableSizeFactor = tableSizeMap[tableSize] / 2
  const playerPerformance = stats.matches[player.id] / tableSizeFactor
  const opponentPerformance = stats.matches[opponent.id] / tableSizeFactor

  const closenessFactor = 1 - Math.abs(playerPerformance - opponentPerformance)

  const actualScore = status === "FINISHED"
    ? (playerPerformance - opponentPerformance) + 0.5
    : status === "CLOSED" ? 1 : -FORCE_CLOSE_SUBTRACT_VALUE

  const gainedElo = calculateGainedElo({
    kFactor: K_FACTORS.PVP,
    scoreMultiplier: closenessFactor * (actualScore - calculateExpectedScore(player.stats.elo, opponent.stats.elo)),
    tableSize,
    timer: stats.timer
  })

  return { newElo: player.stats.elo + gainedElo, gainedElo }
}

/**
 * TODO: write doc
 * 
 * @param session 
 * @param playerId 
 * @returns 
 */
export function coopElo(
  session: Pick<MultiplayerClientSession, "owner" | "guest" | "stats" | "tableSize" | "mode">,
  playerId: string,
  status: Extract<SessionStatus, "FINISHED" | "CLOSED" | "FORCE_CLOSED">
): EloUpdate {
  const { owner, guest, stats, tableSize, mode } = session

  const playerKey = currentPlayerKey(owner.id, playerId)
  const player = playerKey === "owner" ? owner : guest
  const teammate = playerKey === "owner" ? guest : owner

  if (mode === "CASUAL") {
    return { newElo: player.stats.elo, gainedElo: 0 }
  }

  const successRate = stats.matches[player.id] / correctedFlips(stats.flips[player.id])
  const teammateSuccessRate = stats.matches[teammate.id] / correctedFlips(stats.flips[teammate.id])

  const teamPerformance = successRate + teammateSuccessRate
  const teamScore = status === "FORCE_CLOSED" ? -FORCE_CLOSE_SUBTRACT_VALUE
    : (successRate + teamPerformance) / 2

  const gainedElo = calculateGainedElo({
    kFactor: K_FACTORS.COOP,
    scoreMultiplier: teamScore - calculateExpectedScore(player.stats.elo, teammate.stats.elo),
    tableSize,
    timer: stats.timer
  })

  return { newElo: player.stats.elo + gainedElo, gainedElo }
}

/**
 * TODO: write doc
 * 
 * @param session 
 * @param playerId 
 * @returns 
 */
export function calculateElo(
  session: Pick<ClientSession, "owner" | "guest" | "stats" | "tableSize" | "mode" | "format">,
  playerId: string,
  status: Extract<SessionStatus, "FINISHED" | "CLOSED" | "FORCE_CLOSED"> = "FINISHED",
  requesterPlayerId?: string
): EloUpdate {
  const { format, owner } = session

  if (format === "SOLO") {
    return soloElo(session, status)
  }

  if (format === "PVP") {
    let actionStatus = status

    if (requesterPlayerId !== playerId) {
      if (status === "CLOSED") actionStatus = "FORCE_CLOSED"
      if (status === "FORCE_CLOSED") actionStatus = "CLOSED"
    }
    
    return pvpElo(session as MultiplayerClientSession, playerId, actionStatus)
  }

  if (format === "COOP") {
    return coopElo(session as MultiplayerClientSession, playerId, status)
  }

  return { newElo: owner.stats.elo, gainedElo: 0 }
}
