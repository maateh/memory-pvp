import type { Socket } from "socket.io"
import type { SocketResponse as TSocketResponse } from "@repo/types/socket-api"

declare global {
  type SocketResponse<T = unknown> = TSocketResponse<T>
  type SocketEventResponse<T> = (response: SocketResponse<T>) => void
  type SocketEventListener<T = unknown, U = unknown> = (data: T, response: SocketEventResponse<U>) => void
  type SocketEventHandler<T = unknown, U = unknown> = (socket: Socket) => SocketEventListener<T, U>
}
