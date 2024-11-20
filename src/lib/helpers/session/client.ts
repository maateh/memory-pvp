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
  session: Pick<ClientGameSession, 'players' | 'stats' | 'flipped'>,
  action?: 'flip' | 'match'
): PrismaJson.SessionStats {
  const { players, stats, flipped } = session

  const playerId = players.current.id
  
  if (action === 'flip') {
    const prevFlips = stats.flips[playerId]

    stats.flips[playerId] = flipped.length === 1 ? prevFlips + 1 : prevFlips
  }

  if (action === 'match') {
    ++stats.matches[playerId]
  }

  return stats
}
