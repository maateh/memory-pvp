/**
 * K-factor values used to determine the maximum possible Elo adjustment per session.
 * 
 * - `SINGLE`: Used in solo games, allowing moderate Elo adjustments.
 * - `PVP`: Higher value due to the competitive nature of PVP matches.
 * - `COOP`: Lower value to balance cooperative play, as Elo is distributed among teammates.
 */
export const K_FACTORS = {
  SINGLE: 20,
  PVP: 24,
  COOP: 10
}

/**
 * Factor used in the Elo rating system to determine the expected score based on rating differences.
 * 
 * - Used in the expected score calculation: `1 / (1 + 10^((opponentElo - playerElo) / ELO_DIFFERENCE_FACTOR))`.
 */
export const ELO_DIFFERENCE_FACTOR = 400

/** Subtraction factor applied to the solo success rate before calculating Elo gain. */
export const SOLO_SCORE_MULTIPLIER_SUBTRACTOR = 0.45

/**
 * Penalty applied when a session is force-closed by a player.
 * 
 * - Used in Elo calculations to reduce Elo for players who abandon matches.
 * - A fixed negative score multiplier affecting Elo loss.
 */
export const FORCE_CLOSE_SUBTRACT_VALUE = 0.5

/** Multiplier applied to the number of flips to normalize success rates. */
export const CORRECTED_FLIPS_MULTIPLIER = 0.5

/**
 * Multipliers applied to Elo gain based on the session table size.
 * 
 * - Larger tables provide higher multipliers due to increased difficulty.
 * - Used in `calculateGainedElo` to scale Elo adjustments appropriately.
 */
export const TABLE_SIZE_MULTIPLIERS = {
  SMALL: 0.8,
  MEDIUM: 1.0,
  LARGE: 1.2
}

/**
 * Maximum time limits used for scaling time-based Elo adjustments.
 * 
 * - Defines upper bounds for `TIME_BOOSTER_MULTIPLIERS` application.
 * - Ensures that faster completions receive higher Elo rewards.
 */
export const TIME_BOOSTER_LIMITS = {
  SMALL: 60,
  MEDIUM: 90,
  LARGE: 120
}

/**
 * Multipliers applied to Elo gain based on completion time.
 * 
 * - `MIN`: The lowest possible time-based Elo boost.
 * - `MAX`: The highest possible time-based Elo boost.
 * - Adjusts the Elo gain dynamically, rewarding faster completions.
 */
export const TIME_BOOSTER_MULTIPLIERS = {
  MIN: 0.25,
  MAX: 2
}
