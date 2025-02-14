// types
import type { Room } from "@repo/schema/room"

// redis
import { redis } from "@repo/server/redis"
import { getRoom } from "@repo/server/redis-commands"

// error
import { ServerError } from "@repo/server/error"

export const sessionReconnect: SocketEventHandler<
  unknown,
  Room
> = (socket) => async (_, response) => {
  console.log("DEBUG - session:reconnect -> ", socket.id)

  const { roomSlug } = socket.ctx.connection

  try {
    const room = await getRoom<Room>(roomSlug)

    // TODO: implement session reconnection

    socket.join(roomSlug)
    response({
      message: "You have successfully reconnected!",
      description: "Session is continued from where you left off.",
      data: room
    })
  } catch (err) {
    response({
      message: "Failed to reconnect to this session.",
      error: ServerError.parser(err)
    })
  }
}
