// types
import type { RoomVariants } from "@repo/schema/room"

// redis
import { redis } from "@repo/server/redis"
import { playerConnectionKey, roomKey, waitingRoomsKey } from "@repo/server/redis-keys"

// utils
import { ServerError } from "@repo/server/error"

export const roomLoader: SocketMiddlewareFn = async (socket, next) => {
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
    const room = await redis.json.get<RoomVariants>(roomKey(roomSlug))

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

    if (room.status === "waiting") {
      if (room.owner.id !== playerId) {
        await redis.del(playerConnectionKey(playerId))

        ServerError.throw({
          thrownBy: "SOCKET_API",
          key: "ROOM_ACCESS_DENIED",
          message: "You have no access to this room.",
          description: "Please try creating or joining a new room."
        })
      }

      room.connectionStatus = "half_online"
      room.owner.connection = connection
      room.owner.ready = false
    }
  
    if (room.status === "joined" || room.status === "ready") {
      if (room.owner.id !== playerId && room.guest.id !== playerId) {
        await redis.del(playerConnectionKey(playerId))

        ServerError.throw({
          thrownBy: "SOCKET_API",
          key: "ROOM_ACCESS_DENIED",
          message: "You have no access to this room.",
          description: "Please try creating or joining a new room."
        })
      }

      const currentPlayerKey: "owner" | "guest" = room.owner.id === playerId ? "owner" : "guest"
      room[currentPlayerKey].connection = connection

      const ownerIsOnline = room.owner.connection.status === "online"
      const guestIsOnline = room.guest.connection.status === "online"

      room.status = "joined"
      room.connectionStatus = ownerIsOnline && guestIsOnline
        ? "online" : ownerIsOnline || guestIsOnline
        ? "half_online"
        : "offline"
      room.owner.ready = false
      room.guest.ready = false
    }
  
    if (
      room.status === "starting" ||
      room.status === "running"
      // TODO: add -> room.status === "cancelled"
    ) {
      ServerError.throw({
        thrownBy: "SOCKET_API",
        key: "SESSION_ALREADY_STARTED",
        message: "Session has already started.",
        description: "Please try reconnecting to finish the session."
      })
    }

    await redis.json.set(roomKey(room.slug), `$`, room, { xx: true })

    socket.ctx = { ...ctx, connection, room }
    next()
  } catch (err) {
    return next(ServerError.asSocketError(err))
  }
}
