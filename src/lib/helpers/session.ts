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
