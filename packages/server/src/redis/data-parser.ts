// types
import type { PlayerConnection, SocketConnection } from "@repo/server/socket-types"

export function socketConnection(
  socketId: string,
  playerId: string,
  roomSlug: string
): SocketConnection {
  return {
    socketId,
    playerId,
    roomSlug,
    connectedAt: new Date()
  }
}

export function playerConnection({ playerId, roomSlug, status, socketId }: { playerId: string, roomSlug: string } & ({
  status: Extract<PlayerConnection["status"], "online">
  socketId: string
} | {
  status: Extract<PlayerConnection["status"], "offline">
  socketId?: never
})): PlayerConnection {
  return {
    playerId,
    roomSlug,
    status,
    socketId: socketId || null,
    connectedAt: status === "online" ? new Date() : null,
    updatedAt: new Date()
  }
}
