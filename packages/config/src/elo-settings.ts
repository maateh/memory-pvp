// types
import type { MatchFormat, TableSize } from "@repo/db"

/**
 * K-factor values used to determine the maximum possible Elo adjustment per session.
 * 
 * - `SOLO`: Used in solo games, allowing moderate Elo adjustments.
 * - `PVP`: Higher value due to the competitive nature of PVP matches.
 * - `COOP`: Lower value to balance cooperative play, as Elo is distributed among teammates.
 */
export const K_FACTORS: Record<Exclude<MatchFormat, "OFFLINE">, number> = {
  SOLO: 20,
  PVP: 24,
  COOP: 10
} as const

/**
 * Factor used in the Elo rating system to determine the expected score based on rating differences.
 * 
 * - Used in the expected score calculation: `1 / (1 + 10^((opponentElo - playerElo) / ELO_DIFFERENCE_FACTOR))`.
 */
export const ELO_DIFFERENCE_FACTOR = 400 as const

/** Subtraction factor applied to the solo success rate before calculating Elo gain. */
export const SOLO_SCORE_SUBTRACTOR = 0.45 as const

/**
 * Penalty score applied during Elo calculations.
 * 
 * - Used in Elo calculations to reduce Elo for players who abandon matches.
 * - A fixed negative score multiplier affecting Elo loss.
 */
export const PENALTY_SCORE = 0.5 as const

/** Multiplier applied to the number of flips to normalize success rates. */
export const CORRECTED_FLIPS_MULTIPLIER = 0.5 as const

/**
 * Multipliers applied to Elo gain based on the session table size.
 * 
 * - Larger tables provide higher multipliers due to increased difficulty.
 * - Used in `calculateGainedElo` to scale Elo adjustments appropriately.
 */
export const TABLE_SIZE_MULTIPLIERS: Record<TableSize, number> = {
  SMALL: 0.8,
  MEDIUM: 1.0,
  LARGE: 1.2
} as const

/**
 * Maximum time limits used for scaling time-based Elo adjustments.
 * 
 * - Defines upper bounds for `TIME_BOOSTER_MULTIPLIERS` application.
 * - Ensures that faster completions receive higher Elo rewards.
 */
export const TIME_BOOSTER_LIMITS: Record<TableSize, number> = {
  SMALL: 60,
  MEDIUM: 90,
  LARGE: 120
} as const

/**
 * Multipliers applied to Elo gain based on completion time.
 * 
 * - `MIN`: The lowest possible time-based Elo boost.
 * - `MAX`: The highest possible time-based Elo boost.
 * - Adjusts the Elo gain dynamically, rewarding faster completions.
 */
export const TIME_BOOSTER_MULTIPLIERS: Record<"MIN" | "MAX", number> = {
  MIN: 0.25,
  MAX: 2
} as const
