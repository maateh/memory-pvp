// types
import type { SessionRoom } from "@repo/schema/session-room"
import type { SessionReconnectValidation } from "@repo/schema/session-room-validation"

// redis
import { redis } from "@/redis"
import { getSessionRoom } from "@/redis/room-commands"
import { getPlayerConnection } from "@/redis/connection-commands"

// config
import { connectionKey, playerConnectionKey, roomKey } from "@repo/config/redis-keys"

// schema
import { sessionReconnectValidation } from "@repo/schema/session-room-validation"

// error
import { SocketError } from "@repo/types/socket-api-error"

// utils
import { validate } from "@/utils/validate"

export const sessionReconnect: SocketEventHandler<
  SessionReconnectValidation,
  SessionRoom
> = (socket) => async (input, response) => {
  console.log("DEBUG - session:reconnect -> ", socket.id)

  try {
    const { playerId } = validate(sessionReconnectValidation, input)
    const prevConnection = await getPlayerConnection(playerId)
    const room = await getSessionRoom<SessionRoom>(prevConnection.roomSlug)

    if (room.owner.id === playerId) {
      room.owner.socketId = socket.id
      room.owner.ready = true
    } else {
      room.guest.socketId = socket.id
      room.guest.ready = true
    }

    // TODO: add "cancelled" option to room status
    // room.status = room.owner.ready && room.guest.ready ? "running" : "cancelled"

    const connection: SocketPlayerConnection = {
      ...prevConnection,
      socketId: socket.id
    }

    await Promise.all([
      redis.del(connectionKey(prevConnection.socketId)),
      redis.hset(connectionKey(socket.id), connection),
      redis.hset(playerConnectionKey(playerId), connection),
      redis.hset(roomKey(room.slug), room)
    ])

    socket.join(room.slug)
    response({
      success: true,
      message: "You have successfully reconnected!",
      data: room
    })
  } catch (err) {
    response({
      success: false,
      message: "Failed to reconnect to this session.",
      error: SocketError.parser(err),
      data: null
    })
  }
}
