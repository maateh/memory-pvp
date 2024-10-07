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
 * TODO: Write doc.
 * 
 * @param param0 
 * @returns 
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
 * TODO: write doc
 * 
 * @param session 
 * @returns 
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
 * TODO: write doc
 * 
 * @param session 
 * @param playerTag 
 * @returns 
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
