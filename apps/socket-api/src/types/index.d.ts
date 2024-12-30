import type { Socket } from "socket.io"

declare global {
  type SocketEventResponse<T> = (response: {
    success: boolean
    message: string
    data: T
  }) => void

  type SocketEventListener<T = unknown, U = unknown> = (data: T, response: SocketEventResponse<U>) => void
  type SocketEventHandler<T = unknown, U = unknown> = (socket: Socket) => SocketEventListener<T, U>
}
