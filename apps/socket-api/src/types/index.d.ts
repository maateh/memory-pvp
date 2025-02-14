import type { ExtendedError, Socket } from "socket.io"
import type { RoomVariants } from "@repo/schema/room"
import type { PlayerConnection } from "@repo/schema/player-connection"
import type { SocketResponse as TSocketResponse } from "@repo/server/socket-types"

declare global {
  type SocketContextOpts = Partial<{
    clerkId: string
    connection: PlayerConnection
    room: RoomVariants
  }>

  type SocketWithContext = Socket & { ctx: Required<SocketContextOpts> }
  type SocketMiddlewareFn = (
    socket: Socket & Partial<{ ctx: SocketContextOpts }>,
    next: (err?: ExtendedError) => void
  ) => Promise<void>

  type SocketResponse<T = unknown> = TSocketResponse<T>
  type SocketEventResponse<T> = (response: SocketResponse<T>) => void
  type SocketEventListener<T = unknown, U = unknown> = (data: T, response: SocketEventResponse<U>) => void
  type SocketEventHandler<T = unknown, U = unknown> = (socket: SocketWithContext) => SocketEventListener<T, U>
}
