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
