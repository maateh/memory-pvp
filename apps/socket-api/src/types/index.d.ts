import type { Socket } from "socket.io"
import type { SocketError } from "@/error/socket-error"

declare global {
  type SocketResponse<T> = { // TODO: move this type into a shared `@repo/types` package
    success: boolean
    message: string
    data: T | null
    error?: SocketError | null
  }

  type SocketEventResponse<T> = (response: SocketResponse<T>) => void
  type SocketEventListener<T = unknown, U = unknown> = (data: T, response: SocketEventResponse<U>) => void
  type SocketEventHandler<T = unknown, U = unknown> = (socket: Socket) => SocketEventListener<T, U>
}
