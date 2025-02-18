// redis
import { getRoomByField } from "@repo/server/redis-commands"

// socket
import { io } from "@/server"

// utils
import { ServerError } from "@repo/server/error"

export const sessionCreated: SocketEventHandler = (socket) => async () => {
  console.log("session:created ->", socket.id)

  const { roomSlug } = socket.ctx.connection

  try {
    const {
      type,
      mode,
      tableSize
    } = await getRoomByField(roomSlug, "settings")

    io.to(roomSlug).emit("session:started", {
      message: "The game session has started!",
      // TODO: formatting helpers would be cool here
      // (which are currently only used on the client-side)
      description: `${type} | ${mode} | ${tableSize}`,
      data: roomSlug
    } satisfies SocketResponse<string>)
  } catch (err) {
    io.to(roomSlug).emit("session:started", {
      message: "Failed to start game session.",
      error: ServerError.parser(err)
    } satisfies SocketResponse)
  }
}
