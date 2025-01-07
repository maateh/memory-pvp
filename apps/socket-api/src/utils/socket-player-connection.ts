type SocketPlayerConnection = {
  socketId: string
  playerId: string
  roomSlug: string
  connectedAt: Date
}

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
