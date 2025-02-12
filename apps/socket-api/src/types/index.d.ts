import type { ExtendedError, Socket } from "socket.io"
import type { SocketResponse as TSocketResponse } from "@repo/server/socket-types"

declare global {
  type SocketMiddlewareOpts = {
    clerkId?: string
  }

  type SocketMiddleware = Socket & SocketMiddlewareOpts
  type SocketMiddlewareFn = (socket: SocketMiddleware, next: (err?: ExtendedError) => void) => Promise<void>

  type VerifiedSocket = Socket & Required<SocketMiddlewareOpts>

  type SocketResponse<T = unknown> = TSocketResponse<T>
  type SocketEventResponse<T> = (response: SocketResponse<T>) => void
  type SocketEventListener<T = unknown, U = unknown> = (data: T, response: SocketEventResponse<U>) => void
  type SocketEventHandler<T = unknown, U = unknown> = (socket: VerifiedSocket) => SocketEventListener<T, U>
}
