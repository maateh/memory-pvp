// config
import { freeFlipsMultiplier, tableSizeMap } from "@/config/game-settings"

/**
 * Calculates the number of free flips available in the game session based on the session's type, mode, and table size.
 * 
 * - If the session is of type 'CASUAL', no free flips are given, so the function returns `null`.
 * - In 'COMPETITIVE', for 'SINGLE' and 'COOP' modes, the number of free flips
 *   is determined by multiplying the table size by a predefined multiplier.
 * 
 * @param {Object} session - The game session containing the type, mode, and table size.
 * 
 * @returns {number | null} - The calculated free flips based on the session's settings, or `null` if not applicable.
 */
export function getFreeFlips(
  session: Pick<ClientGameSession, 'type' | 'mode' | 'tableSize'>
): number | null {
  const { type, mode, tableSize } = session

  if (type === 'CASUAL') return null

  if (mode === 'SINGLE') {
    return tableSizeMap[tableSize] * freeFlipsMultiplier
  }

  if (mode === 'COOP') {
    // TODO: this calculation is temporary
    return tableSizeMap[tableSize] * freeFlipsMultiplier
  }

  return null
}

/**
 * Calculates the score for a specific player in a game session based on the session's type, mode, and stats.
 * 
 * **Note!**: These calculations are likely not final and might be changed in the future.
 * **Note**: If the session type is 'CASUAL', scoring is not applicable, so the function returns `null`.
 * 
 * - **SINGLE mode**: The score is calculated by comparing the player's flips with the allowed free flips:
 *   - If the player has fewer or equal flips than the free flips, the score equals the free flips.
 *   - If the player exceeds the free flips, the score is reduced by the difference between double the free flips and the player's flips.
 *   - If the player abandons the session (`action === 'abandon'`), the score is set to the negative value of the free flips.
 * - **PVP and COOP modes**: Not yet implemented, and currently return `null`.
 * 
 * @param {Object} session - The game session containing type, mode, table size, and stats.
 * @param {string} playerId - The ID of the player whose score is being calculated.
 * @param {string} [action='finish'] - Specifies whether the player finished or abandoned the session. Defaults to 'finish'.
 * 
 * @returns {number | null} - The player's calculated score, or `null` if scoring is not applicable.
 */
export function calculateSessionScore(
  session: Pick<ClientGameSession, 'type' | 'mode' | 'tableSize' | 'stats'>,
  playerId: string,
  action: 'finish' | 'abandon' = 'finish'
): number | null {
  const { type, mode, tableSize, stats } = session

  if (type === 'CASUAL') return null

  if (mode === 'SINGLE') {
    const freeFlips = getFreeFlips({ type, mode, tableSize })!

    if (action === 'abandon') {
      return -freeFlips
    }

    const flips = stats.flips[playerId]
    const score = freeFlips >= flips
      ? freeFlips
      : freeFlips * 2 - flips

    return score
  }

  if (mode === 'PVP') {
    // TODO: implement
  }

  if (mode === 'COOP') {
    // TODO: implement
  }
  return null
}

/**
 * Generates an array of shuffled session cards from a given card collection for use in a game session.
 * 
 * - Selects a random subset of cards from the provided collection, based on half the collection's `tableSize` to ensure matched pairs.
 * - Duplicates each card, assigning unique keys to create pairs, and initializes `flippedBy` and `matchedBy` as `null`.
 * - Returns a shuffled array of session cards for randomized placement on the game board.
 * 
 * @param {ClientCardCollection} collection - The card collection used to generate session cards, containing a list of memory cards.
 * 
 * @returns {PrismaJson.SessionCard[]} - Array of session cards, each duplicated and shuffled for game use.
 */
export function generateSessionCards(
  collection: ClientCardCollection
): PrismaJson.SessionCard[] {
  const randomCards = collection.cards
    .sort(() => Math.random() - 0.5)
    .slice(0, tableSizeMap[collection.tableSize] / 2)

  const sessionCards = randomCards.reduce((cards, card, index) => {
    const firstKey = index * 2
    const secondKey = index * 2 + 1

    const cardWithoutKey = {
      id: card.id,
      flippedBy: null,
      matchedBy: null
    }

    return [
      ...cards,
      { key: firstKey, ...cardWithoutKey },
      { key: secondKey, ...cardWithoutKey }
    ]
  }, [] as PrismaJson.SessionCard[])

  return sessionCards.sort(() => Math.random() - 0.5)
}

/** Server exports */
export { generateSlug } from "./server"

/** Client exports */
export { validateCardMatches } from "./client"
