// types
import type { RunningRoom } from "@repo/schema/room"

// redis
import { getRoom } from "@repo/server/redis-commands-throwable"

// error
import { ServerError } from "@repo/server/error"

export const sessionCardFlip: SocketEventHandler = (socket) => async (_, response) => {
  console.log("DEBUG - session:card:flip -> ", socket.id)

  const { roomSlug } = socket.ctx.connection

  try {
    const room = await getRoom<RunningRoom>(roomSlug)

    if (room.status !== "running") {
      ServerError.throw({
        thrownBy: "SOCKET_API",
        key: "ROOM_STATUS_CONFLICT",
        message: "Failed to flip card.",
        description: "You can only flip cards if session is running."
      })
    }

    // TODO: handle card flip
    // - "session:card:flipped"
    // - "session:card:matched"
    // - "session:card:unmatched"
  } catch (err) {
    response({
      message: "Failed to flip card.",
      error: ServerError.parser(err)
    })
  }
}
