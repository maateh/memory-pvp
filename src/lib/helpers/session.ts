// utils
import { pickFields } from "@/lib/utils"

// constants
import { clientSessionKeys, clientSessionPlayerKeys } from "@/constants/session"
import { freeFlipsMultiplier, tableSizeMap } from "@/constants/game"

/**
 * Parses a `GameSessionWithOwnerWithPlayersWithAvatar` schema into a `ClientGameSession`, 
 * organizing player data based on the current player's tag.
 * 
 * - The `players` field is structured to have:
 *   - `current`: The player object whose tag matches the `currentPlayerTag`.
 *   - `other`: The other player in the session.
 * 
 * @param {GameSessionWithOwnerWithPlayersWithAvatar} session - The full session data including players and avatars.
 * @param {string} currentPlayerTag - The tag of the current player to identify them in the session.
 * @returns {ClientGameSession} - A parsed session with player data structured into `current` and `other` fields.
 */
export function parseSchemaToClientSession(
  session: GameSessionWithOwnerWithPlayersWithAvatar,
  currentPlayerTag: string
): ClientGameSession {
  const filteredSession = pickFields(session, clientSessionKeys)

  const players = {
    current: filteredSession.players.find((player) => player.tag === currentPlayerTag)!,
    other: filteredSession.players.find((player) => player.tag !== currentPlayerTag)
  }

  return {
    ...filteredSession,
    players: {
      current: pickFields(players.current, clientSessionPlayerKeys),
      other: players.other && pickFields(players.other, clientSessionPlayerKeys)
    }
  }
}

type ValidatedMemoryCard = Omit<PrismaJson.MemoryCard, 'isFlipped' | 'isMatched'> & {
  isFlipped: true
  isMatched: true
}

/**
 * Validates all memory cards by marking them as flipped and matched.
 * 
 * - This function takes an array of `MemoryCard` objects and transforms each card by setting both 
 *   `isFlipped` and `isMatched` to `true`.
 * 
 * - Useful for scenarios where all cards in the game need to be programmatically validated as matched 
 *   (e.g., game completion or debugging).
 * 
 * @param {PrismaJson.MemoryCard[]} cards - Array of memory card objects to be validated.
 * 
 * @returns {ValidatedMemoryCard[]} - A new array of cards where all cards are flipped and matched.
 */
export function validateCardMatches(cards: PrismaJson.MemoryCard[]): ValidatedMemoryCard[] {
  return cards.map((card) => ({
    ...card,
    isMatched: true,
    isFlipped: true
  }))
}

/**
 * Updates the game session statistics based on the given action.
 * 
 * Actions:
 * - Flip: the 'flip' statistic counter for the current player
 *   is incremented when one pair of cards is flipped. Flips are
 *   only counted after the second card (one pair) is flipped.
 * 
 * - Match: the 'matches' statistic counter for the current player
 *   is incremented when the player finds a pair of cards (that match).
 * 
 * @param {Object} session - The current game session, containing the players, stats, and flipped cards information.
 * @param {'flip' | 'match'} [action] - Specifies whether the action performed is a card flip or a match.
 * 
 * @returns {PrismaJson.SessionStats} - The updated session statistics.
 */
export function updateSessionStats(
  session: Pick<ClientGameSession, 'players' | 'stats' | 'flippedCards'>,
  action?: 'flip' | 'match'
): PrismaJson.SessionStats {
  const { players, stats, flippedCards } = session

  const playerTag = players.current.tag
  const prevFlips = stats.flips[playerTag]

  if (action === 'flip') {
    stats.flips[playerTag] = flippedCards.length === 1
      ? prevFlips + 1
      : prevFlips
  }

  if (action === 'match') {
    // TODO: add 'matches' to 'SessionStats' & 'Result' model
    // stats.matches[playerTag] = ...
  }

  return stats
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

/**
 * Calculates the score for a specific player in a game session based on the session's type, mode, and stats.
 * 
 * NOTE: These calculations are likely not final and might be changed in the future.
 * 
 * - If the session type is 'CASUAL', scoring is not applicable, so the function returns `null`.
 * - In 'SINGLE' mode, the score is calculated by comparing the player's number of flips with the allowed free flips.
 *   - If the player has fewer or equal flips than the free flips, the score is equal to the free flips.
 *   - If the player exceeds the free flips, the score is reduced by the difference between double the free flips and the player's flips.
 * - Modes like 'PVP' and 'COOP' are not yet implemented and return `null`.
 * 
 * @param {Object} session - The game session containing type, mode, table size, and stats.
 * @param {string} playerTag - The tag of the player whose score is being calculated.
 * 
 * @returns {number | null} - The player's calculated score or `null` if scoring is not applicable.
 */
export function calculateSessionScore(
  session: Pick<ClientGameSession, 'type' | 'mode' | 'tableSize' | 'stats'>,
  playerTag: string
): number | null {
  const { type, mode, tableSize, stats } = session

  if (type === 'CASUAL') return null

  if (mode === 'SINGLE') {
    const freeFlips = getFreeFlips({ type, mode, tableSize })!
    const flips = stats.flips[playerTag]

    if (freeFlips >= flips) return freeFlips
    return freeFlips * 2 - flips
  }

  if (mode === 'PVP') {
    // TODO: implement
  }

  if (mode === 'COOP') {
    // TODO: implement
  }
  return null
}
