// redis
import { redis } from "@repo/server/redis"
import { getRoom } from "@repo/server/redis-commands"
import { playerConnectionKey, waitingRoomsKey } from "@repo/server/redis-keys"

// utils
import { ServerError } from "@repo/server/error"

export const roomAccess: SocketMiddlewareFn = async (socket, next) => {
  const { connection, ...ctx } = socket.ctx || {}

  try {
    if (!connection) {
      ServerError.throw({
        thrownBy: "SOCKET_API",
        key: "PLAYER_CONNECTION_NOT_FOUND",
        message: "Player connection data not found.",
        description: "Please try creating or joining a new room."
      })
    }

    const { playerId, roomSlug } = connection
    const room = await getRoom(roomSlug)

    if (!room) {
      await Promise.all([
        redis.del(playerConnectionKey(playerId)),
        redis.lrem(waitingRoomsKey, 1, roomSlug)
      ])

      ServerError.throw({
        thrownBy: "SOCKET_API",
        key: "ROOM_NOT_FOUND",
        message: "Room not found.",
        description: "Please try creating or joining a new room."
      })
    }

    if (room.status === "waiting" && room.owner.id !== playerId) {
      await redis.del(playerConnectionKey(playerId))

      ServerError.throw({
        thrownBy: "SOCKET_API",
        key: "ROOM_ACCESS_DENIED",
        message: "You have no access to this room.",
        description: "Please try creating or joining a new room."
      })
    }
  
    if (
      room.status !== "waiting" &&
      room.owner.id !== playerId &&
      room.guest.id !== playerId
    ) {
      await redis.del(playerConnectionKey(playerId))

      ServerError.throw({
        thrownBy: "SOCKET_API",
        key: "ROOM_ACCESS_DENIED",
        message: "You have no access to this room.",
        description: "Please try creating or joining a new room."
      })
    }

    socket.ctx = { ...ctx, connection, room }
    next()
  } catch (err) {
    return next(ServerError.asSocketError(err))
  }
}
