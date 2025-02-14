import type { PlayerConnectionStatus } from "@repo/schema/player-connection"
import type { ServerError } from "../error/error"

export type SocketResponse<T = unknown> = {
  message: string
  description?: string
  data?: T | null
  error?: ServerError | null
}

export type SocketConnection = {
  socketId: string
  playerId: string
  roomSlug: string
  connectedAt: Date
}

export type PlayerConnection = {
  playerId: string
  playerTag: string
  roomSlug: string
  createdAt: Date
} & ({
  status: Extract<PlayerConnectionStatus, "online">
  socketId: string
  connectedAt: Date
} | {
  status: Extract<PlayerConnectionStatus, "offline">
  socketId: null
  connectedAt: null
})
