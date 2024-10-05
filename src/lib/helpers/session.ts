/**
 * TODO: write documentation
 * 
 * @param session 
 * @param currentPlayerTag 
 * @returns 
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
 * TODO: write documentation
 * 
 * @param cards 
 * @returns 
 */
type ValidatedMemoryCard = Omit<PrismaJson.MemoryCard, 'isFlipped' | 'isMatched'> & {
  isFlipped: true
  isMatched: true
}

export function validateCardMatches(cards: PrismaJson.MemoryCard[]): ValidatedMemoryCard[] {
  return cards.map((card) => ({
    ...card,
    isMatched: true,
    isFlipped: true
  }))
}
