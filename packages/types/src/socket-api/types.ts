import type { RoomPlayerStatus } from "@repo/schema/player"
import type { SocketError } from "./error"

export type SocketResponse<T = unknown> = {
  message: string
  description?: string
  data?: T | null
  error?: SocketError | null
}

export type SocketConnection = {
  socketId: string
  playerId: string
  roomSlug: string
  connectedAt: Date
}

export type PlayerConnection = {
  playerId: string
  roomSlug: string
  socketId: string | null
  status: RoomPlayerStatus
  connectedAt: Date | null
  updatedAt: Date
}
