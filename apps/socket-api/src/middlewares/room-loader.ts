// types
import type { RoomVariants } from "@repo/schema/room"

// redis
import { saveRedisJson } from "@repo/server/redis-json"
import { roomKey } from "@repo/server/redis-keys"

// helpers
import { currentPlayerKey } from "@repo/helper/player"

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
    const playerKey = currentPlayerKey(room.owner.id, playerId)

    if (room.status === "waiting") {
      room.connectionStatus = "half_online"
      room.owner.connection = connection
      room.owner.ready = false
    }
  
    if (room.status === "joined" || room.status === "ready") {
      room[playerKey].connection = connection
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
      room[playerKey].connection = connection
      const ownerIsOnline = room.owner.connection.status === "online"
      const guestIsOnline = room.guest.connection.status === "online"

      room.status = "cancelled"
      room.connectionStatus = ownerIsOnline && guestIsOnline
        ? "online" : ownerIsOnline || guestIsOnline
        ? "half_online" : "offline"
      room.owner.ready = false
      room.guest.ready = false
    }

    const updater: Partial<RoomVariants> = {
      status: room.status,
      connectionStatus: room.connectionStatus,
      owner: room.owner
    }
    if (room.guest) updater.guest = room.guest

    const { error } = await saveRedisJson(roomKey(room.slug), "$", updater, {
      type: "update",
      override: { xx: true }
    })

    if (error) {
      ServerError.throw({
        thrownBy: "SOCKET_API",
        key: "UNKNOWN",
        message: "Failed to store updated room data.",
        description: "Cache server probably not available."
      })
    }

    socket.ctx = { ...ctx, connection, room }
    next()
  } catch (err) {
    console.log({err})
    return next(ServerError.asSocketError(err))
  }
}
