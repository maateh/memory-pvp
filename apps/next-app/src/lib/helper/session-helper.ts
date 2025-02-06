// types
import type { MemoryCard } from "@repo/db"
import type { ClientCardCollection } from "@/lib/schema/collection-schema"
import type { ClientGameSession, ClientSessionCard } from "@repo/schema/session"

// config
import { freeFlipsMultiplier, tableSizeMap } from "@/config/game-settings"

/**
 * Generates an array of shuffled session cards from a given card collection for use in a game session.
 * 
 * - Selects a random subset of cards from the provided collection, based on half the collection's `tableSize` to ensure matched pairs.
 * - Duplicates each card, assigning unique keys to create pairs, and initializes `matchedBy` as `null`.
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

    return [
      ...cards,
      { key: firstKey, id: card.id, matchedBy: null },
      { key: secondKey, id: card.id, matchedBy: null }
    ] satisfies PrismaJson.SessionCard[]
  }, [] as PrismaJson.SessionCard[])

  return sessionCards.sort(() => Math.random() - 0.5)
}

/**
 * Pairs session cards with their corresponding image URLs from a card collection.
 * 
 * - Maps `collectionCards` to create a lookup object (`urlsMap`) where each card's ID corresponds to its image URL.
 * - Iterates over `sessionCards` and adds the matching `imageUrl` from `urlsMap` to each card object.
 * - Returns an array of `ClientSessionCard` objects, where each session card is enriched with the associated `imageUrl`.
 * 
 * @param {PrismaJson.SessionCard[]} sessionCards - The session cards that require image URLs.
 * @param {Pick<MemoryCard, 'id' | 'imageUrl'>[]} collectionCards - The collection of memory cards with image URLs to match with session cards.
 * 
 * @returns {ClientSessionCard[]} - A list of session cards with added `imageUrl` fields for client display.
 */
export function pairSessionCardsWithCollection(
  sessionCards: PrismaJson.SessionCard[],
  collectionCards: Pick<MemoryCard, 'id' | 'imageUrl'>[]
): ClientSessionCard[] {
  const urlsMap = collectionCards.reduce((urlsMap, card) => ({
    ...urlsMap,
    [card.id]: card.imageUrl
  }), {} as Record<string, string>)

  const cards = sessionCards.map((card) => ({
    ...card,
    imageUrl: urlsMap[card.id]
  }))

  return cards
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
export function calculatePlayerSessionScore(
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

type ValidatedMemoryCard = Omit<ClientSessionCard, 'matchedBy'> & {
  matchedBy: string
}

/**
 * Validates all memory cards by marking them as flipped and matched.
 * 
 * - This function takes an array of `MemoryCard` objects and
 *   transforms each card by updating `matchedBy` to required.
 * 
 * - Useful for scenarios where all cards in the game need to be programmatically validated as matched 
 *   (e.g., game completion or debugging).
 * 
 * @param {ClientSessionCard[]} cards - Array of memory card objects to be validated.
 * 
 * @returns {ValidatedMemoryCard[]} - A new array of cards where all cards are surely matched.
 */
export function validateCardMatches(cards: ClientSessionCard[]): ValidatedMemoryCard[] {
  return cards.map((card) => ({
    ...card,
    matchedBy: card.matchedBy!
  }))
}
