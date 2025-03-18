// types
import type { TableSize } from "@repo/db"
import type { ClientSession, MultiplayerClientSession, SoloClientSession } from "@repo/schema/session"

// config
import {
  K_FACTORS,
  TABLE_SIZE_MULTIPLIERS,
  TIME_BOOSTER_MULTIPLIERS,
  TIME_BOOSTER_LIMIT,
  SOLO_MINUS_SCORE_FACTOR
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
  return 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400))
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
    const timeBoosterLimit = TIME_BOOSTER_LIMIT[tableSize]

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
 * @param session 
 * @returns 
 */
export function soloElo(
  session: Pick<SoloClientSession, "owner" | "stats" | "tableSize" | "mode">
): EloUpdate {
  const { owner, stats, tableSize, mode } = session

  if (mode === "CASUAL") {
    return { newElo: owner.stats.elo, gainedElo: 0 }
  }

  const correctedFlips = stats.flips[owner.id] * 0.5
  const successRate = stats.matches[owner.id] / correctedFlips

  const gainedElo = calculateGainedElo({
    kFactor: K_FACTORS.SINGLE,
    scoreMultiplier: successRate - SOLO_MINUS_SCORE_FACTOR,
    tableSize,
    timer: stats.timer // FIXME: save session timer
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
  playerId: string
): EloUpdate {
  const { owner, guest, stats, tableSize, mode } = session

  const playerKey = currentPlayerKey(owner.id, playerId)
  const player = playerKey === "owner" ? owner : guest
  const opponent = playerKey === "owner" ? guest : owner

  if (mode === "CASUAL") {
    return { newElo: player.stats.elo, gainedElo: 0 }
  }

  // TODO: Note (!): `PVP` Elo calculation hasn't been completely tested yet.

  const isWinner = stats.matches[player.id] > stats.matches[opponent.id]
  const actualScore = isWinner ? 1 : 0

  const gainedElo = calculateGainedElo({
    kFactor: K_FACTORS.PVP,
    scoreMultiplier: actualScore - calculateExpectedScore(player.stats.elo, opponent.stats.elo),
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
  playerId: string
): EloUpdate {
  const { owner, guest, stats, tableSize, mode } = session

  const playerKey = currentPlayerKey(owner.id, playerId)
  const player = playerKey === "owner" ? owner : guest
  const teammate = playerKey === "owner" ? guest : owner

  if (mode === "CASUAL") {
    return { newElo: player.stats.elo, gainedElo: 0 }
  }

  // TODO: Note (!): `COOP` Elo calculation hasn't been completely tested yet.

  const correctedFlips = (playerId: string) => stats.flips[playerId] * 0.5
  const successRate = stats.matches[player.id] / correctedFlips(player.id)
  const teammateSuccessRate = stats.matches[teammate.id] / correctedFlips(teammate.id)

  const teamPerformance = successRate + teammateSuccessRate
  const teamScore = (successRate + teamPerformance) / 2

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
  playerId: string
): EloUpdate {
  const { format, owner } = session

  if (format === "SOLO") {
    return soloElo(session)
  }

  if (format === "PVP") {
    return pvpElo(session as MultiplayerClientSession, playerId)
  }

  if (format === "COOP") {
    return coopElo(session as MultiplayerClientSession, playerId)
  }

  return { newElo: owner.stats.elo, gainedElo: 0 }
}
