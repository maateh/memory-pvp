// types
import type { ClientSession as ClientSessionVariants } from "@repo/schema/session"

// config
import { freeFlipsMultiplier, tableSizeMap } from "@repo/config/game"

/**
* @deprecated Will be replaced by an elo helper.
 * 
 * Calculates the number of free flips available in the game session based on the session's type, mode, and table size.
 *
 * - If the session is of type `CASUAL`, no free flips are given, so the function returns `null`.
 * - In `RANKED`, for `SOLO` and `COOP` modes, the number of free flips
 *   is determined by multiplying the table size by a predefined multiplier.
 *
 * @param {Object} session - The game session containing the type, mode, and table size.
 *
 * @returns {number | null} - The calculated free flips based on the session's settings, or `null` if not applicable.
 */
export function getFreeFlips(
  session: Pick<ClientSessionVariants, "mode" | "format" | "tableSize">
): number | null {
  const { mode, format, tableSize } = session

  if (mode === "CASUAL") return null

  if (format === "SOLO") {
    return tableSizeMap[tableSize] * freeFlipsMultiplier
  }

  if (format === "COOP") {
    return tableSizeMap[tableSize] * freeFlipsMultiplier
  }

  return null
}

/**
 * @deprecated Will be replaced by an elo helper.
 * 
 * Calculates the score for a specific player in a game session based on the session's type, mode, and stats.
 *
 * - `SOLO mode`: The score is calculated by comparing the player's flips with the allowed free flips:
 *   - If the player has fewer or equal flips than the free flips, the score equals the free flips.
 *   - If the player exceeds the free flips, the score is reduced by the difference between double the free flips and the player's flips.
 *   - If the player abandons the session (`action === 'abandon'`), the score is set to the negative value of the free flips.
 * - `PVP and COOP modes`: Not yet implemented, and currently return `null`.
 *
 * @param {Object} session - The game session containing type, mode, table size, and stats.
 * @param {string} playerId - The ID of the player whose score is being calculated.
 * @param {string} [action="finish"] - Specifies whether the player finished or abandoned the session. Defaults to `finish`.
 *
 * @returns {number | null} - The player's calculated score, or `null` if scoring is not applicable.
 */
export function calculatePlayerSessionScore(
  session: Pick<ClientSessionVariants, "mode" | "format" | "tableSize" | "stats">,
  playerId: string,
  action: "finish" | "abandon" = "finish"
): number | null {
  const { mode, format, tableSize, stats } = session

  if (mode === "CASUAL") return null

  if (format === "SOLO") {
    const freeFlips = getFreeFlips({ mode, format, tableSize })!

    if (action === "abandon") {
      return -freeFlips
    }

    const flips = stats.flips[playerId]
    const score = freeFlips >= flips ? freeFlips : freeFlips * 2 - flips

    return score
  }

  if (format === "PVP") {
    // TODO: implement
  }

  if (format === "COOP") {
    // TODO: implement
  }

  return null
}
