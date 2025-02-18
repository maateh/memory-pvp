// types
import type { RoomVariants } from "@repo/schema/room"

// redis
import { redis } from "@repo/server/redis"
import { roomKey } from "@repo/server/redis-keys"

export const roomLoader: SocketMiddlewareFn = async (socket, next) => {
  const { connection, ...ctx } = socket.ctx || {}

  try {
    if (!connection) {
      return next(new Error("Player connection not found."))
    }

    const { playerId, roomSlug } = connection
    const room = await redis.json.get<RoomVariants>(roomKey(roomSlug))

    if (!room) {
      return next(new Error("Room data not found."))
    }

    if (room.status === "waiting") {
      if (room.owner.id !== playerId) {
        return next(new Error("You have no access to this room."))
      }

      room.connectionStatus = "half_online"
      room.owner.connection = connection
      room.owner.ready = false
    }
  
    if (room.status === "joined" || room.status === "ready") {
      if (room.owner.id !== playerId && room.guest.id !== playerId) {
        return next(new Error("You have no access to this room."))
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
      // TODO: implement session reconnection
      return next(new Error("Session has already started in this room."))
    }

    await redis.json.set(roomKey(room.slug), `$`, room, { xx: true })

    socket.ctx = { ...ctx, connection, room }
    next()
  } catch (err) {
    console.error("Room loader error: ", err)
    // TODO: use `ServerError` instead
    return next(new Error("Something went wrong."))
  }
}
