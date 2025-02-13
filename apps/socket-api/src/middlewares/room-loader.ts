// types
import type { RoomVariants } from "@repo/schema/session-room"

// redis
import { redis } from "@repo/server/redis"
import { roomKey } from "@repo/server/redis-keys"

export const roomLoader: SocketMiddlewareFn = async (socket, next) => {
  const { connection, ...ctx } = socket.ctx || {}

  try {
    if (!connection) {
      return next(new Error("Player connection not found."))
    }

    const room = await redis.json.get<RoomVariants>(roomKey(connection.roomSlug))

    if (!room) {
      return next(new Error("Room data not found."))
    }

    socket.ctx = { ...ctx, connection, room }
    next()
  } catch (err) {
    console.error("Player connection error: ", err)
    // TODO: use `ServerError` instead
    return next(new Error("Something went wrong."))
  }
}
