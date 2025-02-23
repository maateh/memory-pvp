// types
import type { RunningRoom } from "@repo/schema/room"

// redis
import { getRoom } from "@repo/server/redis-commands-throwable"

// socket
import { io } from "@/server"

// utils
import { ServerError } from "@repo/server/error"

export const sessionCreated: SocketEventHandler = (socket) => async () => {
  console.log("session:created ->", socket.id)

  const { roomSlug } = socket.ctx.connection

  try {
    const room = await getRoom<RunningRoom>(roomSlug)
    const { type, mode, tableSize } = room.settings

    io.to(roomSlug).emit("session:started", {
      message: "The game session has started!",
      description: `${type} | ${mode} | ${tableSize}`,
      data: room
    } satisfies SocketResponse<RunningRoom>)
  } catch (err) {
    io.to(roomSlug).emit("session:started", {
      message: "Failed to start game session.",
      error: ServerError.parser(err)
    } satisfies SocketResponse)
  }
}
