import type { Socket } from "socket.io"
import type { SocketResponse as TSocketResponse } from "@repo/types/socket-api"
import type { SocketError } from "@repo/types/socket-api-error"

declare global {
  type SocketPlayerConnection = {
    socketId: string
    playerId: string
    roomSlug: string
    connectedAt: Date
  }
  
  type SocketResponse<T = unknown> = TSocketResponse<T>
  type SocketEventResponse<T> = (response: SocketResponse<T>) => void
  type SocketEventListener<T = unknown, U = unknown> = (data: T, response: SocketEventResponse<U>) => void
  type SocketEventHandler<T = unknown, U = unknown> = (socket: Socket) => SocketEventListener<T, U>
}
