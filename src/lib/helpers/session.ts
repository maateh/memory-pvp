import { differenceInSeconds } from "date-fns"

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
  return {
    ...session,
    players: {
      current: session.players.find((player) => player.tag === currentPlayerTag)!,
      other: session.players.find((player) => player.tag !== currentPlayerTag)
    }
  }
}

/**
 * Calculates the total elapsed time for a game session.
 * 
 * - Computes the time passed since the session started or was continued.
 * - Adds the previously accumulated time from the session's stats.
 * 
 * @param {ClientGameSession} session - The game session containing start time, continue time, and timer stats.
 * 
 * @returns {number} - The total elapsed session time in seconds.
 */
export function calculateSessionTimer({
  startedAt, continuedAt, stats
}: Pick<ClientGameSession, 'startedAt' | 'continuedAt' | 'stats'>): number {
  return differenceInSeconds(
    Date.now(),
    continuedAt || startedAt
  ) + stats.timer
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
