export function socketPlayerConnection(
  socketId: string,
  playerId: string,
  roomSlug: string
): SocketPlayerConnection {
  return {
    socketId,
    playerId,
    roomSlug,
    connectedAt: new Date()
  }
}
