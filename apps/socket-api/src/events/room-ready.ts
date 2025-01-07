// types
import type { ReadyRoomValidation } from "@repo/schema/session-room-validation"
import type { ReadiedRoom } from "@repo/schema/session-room"

// redis
import { redis } from "@repo/redis"

// schema
import { joinSessionRoomSchema } from "@repo/schema/session-room-validation"

// error
import { SocketError } from "@/error/socket-error"

// utils
import { validate } from "@/utils/validate"

export const roomReady: SocketEventHandler<
  ReadyRoomValidation,
  ReadiedRoom
> = (socket) => async (input, response) => {
  console.log("DEBUG - room:ready -> ", socket.id)

  try {
    const { roomSlug } = validate(joinSessionRoomSchema, input)

    const playerId = await redis.hget(`memory:connections:${socket.id}`, 'playerId')
    if (!playerId) {
      // TODO: force close session

      SocketError.throw({
        key: "PLAYER_CONNECTION_NOT_FOUND",
        message: "Player connection data not found.",
        description: "Something went wrong because your connection data has been lost. The session will be closed without point losses."
      })
    }

    const readiedRoom = await redis.hgetall<ReadiedRoom>(`memory:session_rooms:${roomSlug}`)
    if (!readiedRoom) {
      SocketError.throw({
        key: "ROOM_NOT_FOUND",
        message: "Session room not found.",
        description: "Sorry, but the room you are trying to join has been closed."
      })
    }
    
    readiedRoom.owner.ready = readiedRoom.owner.id === playerId
    readiedRoom.guest.ready = readiedRoom.guest.id === playerId
    readiedRoom.status = readiedRoom.owner.ready && readiedRoom.guest.ready ? "ready" : "joined"
    await redis.hset(`memory:session_rooms:${roomSlug}`, readiedRoom)

    const readyMessage = "Session room is ready. Game will start soon..."

    socket.broadcast.to(roomSlug).emit("room:readied", {
      message: readiedRoom.status === "ready" ? readyMessage : "Waiting for you to be ready...",
      data: readiedRoom
    })

    response({
      success: true,
      message: readiedRoom.status === "ready" ? readyMessage : "Waiting for the other player to be ready...",
      data: readiedRoom
    })
  } catch (err) {
    console.error(err)
    response({
      success: false,
      message: "Failed to set your status as ready. Please try again.",
      error: SocketError.parser(err),
      data: null
    })
  }
}
