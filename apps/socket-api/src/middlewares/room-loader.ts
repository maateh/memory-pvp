// redis
import { redis } from "@repo/server/redis"
import { roomKey } from "@repo/server/redis-keys"

// utils
import { ServerError } from "@repo/server/error"

export const roomLoader: SocketMiddlewareFn = async (socket, next) => {
  const { connection, room, ...ctx } = socket.ctx || {}

  try {
    if (!connection) {
      ServerError.throw({
        thrownBy: "SOCKET_API",
        key: "PLAYER_CONNECTION_NOT_FOUND",
        message: "Player connection data not found.",
        description: "Please try creating or joining a new room."
      })
    }

    if (!room) {
      ServerError.throw({
        thrownBy: "SOCKET_API",
        key: "ROOM_NOT_FOUND",
        message: "Room not found.",
        description: "Please try creating or joining a new room."
      })
    }

    const { playerId } = connection

    if (room.status === "waiting") {
      room.connectionStatus = "half_online"
      room.owner.connection = connection
      room.owner.ready = false
    }
  
    if (room.status === "joined" || room.status === "ready") {
      const currentPlayerKey: "owner" | "guest" = room.owner.id === playerId ? "owner" : "guest"
      room[currentPlayerKey].connection = connection

      const ownerIsOnline = room.owner.connection.status === "online"
      const guestIsOnline = room.guest.connection.status === "online"

      room.status = "joined"
      room.connectionStatus = ownerIsOnline && guestIsOnline
        ? "online" : ownerIsOnline || guestIsOnline
        ? "half_online" : "offline"
      room.owner.ready = false
      room.guest.ready = false
    }
  
    if (room.status === "running" || room.status === "cancelled") {
      const currentPlayerKey: "owner" | "guest" = room.owner.id === playerId ? "owner" : "guest"
      room[currentPlayerKey].connection = connection

      const ownerIsOnline = room.owner.connection.status === "online"
      const guestIsOnline = room.guest.connection.status === "online"

      room.status = "cancelled"
      room.connectionStatus = ownerIsOnline && guestIsOnline
        ? "online" : ownerIsOnline || guestIsOnline
        ? "half_online" : "offline"
      room.owner.ready = false
      room.guest.ready = false
    }

    await redis.json.set(roomKey(room.slug), `$`, room, { xx: true })
    socket.ctx = { ...ctx, connection, room }
    next()
  } catch (err) {
    return next(ServerError.asSocketError(err))
  }
}
