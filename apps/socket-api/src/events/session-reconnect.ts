// types
import type { SessionRoom } from "@repo/schema/session-room"
import type { SessionReconnectValidation } from "@repo/schema/session-room-validation"

// redis
import { redis } from "@repo/server/redis"
import { getPlayerConnection, getRoom } from "@repo/server/redis-commands"
import { connectionKey, playerConnectionKey, roomKey } from "@repo/server/redis-keys"

// schema
import { sessionReconnectValidation } from "@repo/schema/session-room-validation"

// error
import { ServerError } from "@repo/server/error"

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
    const room = await getRoom<SessionRoom>(prevConnection.roomSlug)

    if (room.owner.id === playerId) {
      room.owner.socketId = socket.id
      room.owner.ready = true
    } else {
      room.guest.socketId = socket.id
      room.guest.ready = true
    }

    // TODO: add "cancelled" option to room status
    // room.status = room.owner.ready && room.guest.ready ? "running" : "cancelled"

    // FIXME: implement session reconnection
    // const connection: SocketConnection = {
    //   ...prevConnection,
    //   socketId: socket.id
    // }

    // await Promise.all([
    //   redis.del(connectionKey(prevConnection.socketId)),
    //   redis.hset(connectionKey(socket.id), connection),
    //   redis.hset(playerConnectionKey(playerId), connection),
    //   redis.json.set(roomKey(room.slug), "$", room, { xx: true })
    // ])

    socket.join(room.slug)
    // TODO: notify joined player -> `socket.broadcast`

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
