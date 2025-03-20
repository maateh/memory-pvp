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
 * Calculates the gained Elo rating based on various game factors.
 * 
 * This function computes the Elo gain using the provided K-factor, score multiplier, 
 * table size, and an optional timer-based adjustment. The Elo gain is influenced by
 * predefined table size multipliers and time-based boosters.
 * 
 * @param {CalculateGainedEloOpts} options The options for calculating Elo gain, including 
 *        K-factor, score multiplier, table size, and an optional timer.
 * @returns {number} The calculated Elo gain, rounded to the nearest integer.
 */
export function calculateGainedElo(
  options: CalculateGainedEloOpts
): number {
  const { kFactor, scoreMultiplier, tableSize, timer } = options
  const sizeMultiplier = TABLE_SIZE_MULTIPLIERS[tableSize]

  const gainedElo = kFactor * scoreMultiplier * sizeMultiplier
  if (!timer) return Math.round(gainedElo)

  const minTimeMultiplier = TIME_BOOSTER_MULTIPLIERS.MIN
  const maxTimeMultiplier = TIME_BOOSTER_MULTIPLIERS.MAX
  const timeBoosterLimit = TIME_BOOSTER_LIMITS[tableSize]

  const timeFactor = Math.max(
    minTimeMultiplier,
    maxTimeMultiplier - timer / timeBoosterLimit
  )

  const gainedEloWithTimeFactor = gainedElo >= 0
    ? gainedElo * timeFactor : gainedElo / timeFactor
  return Math.round(gainedEloWithTimeFactor)
}

/**
 * Adjusts the number of flips using a predefined multiplier.
 * 
 * Applies the `CORRECTED_FLIPS_MULTIPLIER` to the given number of flips. 
 * If the result is falsy (e.g., zero or NaN), it defaults to `1` to ensure a valid output.
 * 
 * @param {number} flips The original number of flips.
 * @returns {number} The adjusted number of flips, ensuring a minimum value of `1`.
 */
function correctedFlips(flips: number): number {
  return (flips * CORRECTED_FLIPS_MULTIPLIER) || 1
}

/**
 * Calculates the Elo update for a solo session based on the player's performance.
 * 
 * - If the session mode is `CASUAL`, the Elo remains unchanged.
 * - If the session was not forcefully closed, the success rate is computed as matches found divided by corrected flips.
 * - If the session was `FORCE_CLOSED`, a penalty is applied.
 * - Elo gain is determined using the `calculateGainedElo` function with predefined factors.
 * 
 * @param {SoloClientSession} session Solo session data, including the owner, session stats, table size, and mode.
 * @param {SessionStatus} status Session "action" status, which affects the Elo calculation.
 * @returns {EloUpdate} The updated Elo score and the gained Elo for the player.
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
 * Calculates the Elo update for a player in a PVP session based on performance.
 * 
 * - If the session mode is `CASUAL`, the Elo remains unchanged.
 * - Performance is measured using matches found relative to the table size.
 * - The closeness factor adjusts the impact based on the difference in performance.
 * - Elo gain is calculated using the expected score, closeness factor, and match outcome.
 * 
 * @param {MultiplayerClientSession} session PvP session data, including both players, stats, table size, and mode.
 * @param {string} playerId The ID of the player whose Elo is being calculated.
 * @param {SessionStatus} status Session "action" status, which affects the Elo calculation.
 * @returns {EloUpdate} The updated Elo score and the gained Elo for the player.
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
 * Calculates the Elo update for a player in a cooperative (Co-Op) session.
 * 
 * - If the session mode is `CASUAL`, the Elo remains unchanged.
 * - Performance is measured based on the player's match success rate.
 * - The team performance is determined by both players' success rates.
 * - Elo gain is adjusted based on the expected score and session status.
 * 
 * @param {MultiplayerClientSession} session Co-Op session data, including both players, stats, table size, and mode.
 * @param {string} playerId The ID of the player whose Elo is being calculated.
 * @param {SessionStatus} status Session "action" status, affecting the Elo calculation.
 * @returns {EloUpdate} The updated Elo score and the gained Elo for the player.
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
 * Calculates the Elo update for a player based on the session format.
 * 
 * - Determines the correct Elo calculation method based on the session format.
 * - Adjusts the session status in PVP mode if the requester is different from the player.
 * - If the format is unrecognized, the player's Elo remains unchanged.
 * 
 * @param {ClientSession} session Session data, including players, stats, table size, mode, and format.
 * @param {string} playerId The ID of the player whose Elo is being calculated.
 * @param {SessionStatus} status Session "action" status, affecting the Elo calculation (default: `FINISHED`).
 * @param {string} requesterPlayerId (Optional) The ID of the player making the calculation request, used for PVP status adjustments.
 * @returns {EloUpdate} The updated Elo score and the gained Elo for the player.
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
