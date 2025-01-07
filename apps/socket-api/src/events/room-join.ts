// types
import type { JoinSessionRoomValidation } from "@repo/schema/session-room-validation"
import type { JoinedRoom, WaitingRoom } from "@repo/schema/session-room"

// redis
import { redis } from "@repo/redis"

// schema
import { joinSessionRoomSchema } from "@repo/schema/session-room-validation"

// error
import { SocketError } from "@/error/socket-error"

// utils
import { socketPlayerConnection } from "@/utils/socket-player-connection"
import { validate } from "@/utils/validate"

export const roomJoin: SocketEventHandler<
  JoinSessionRoomValidation,
  JoinedRoom
> = (socket) => async (input, response) => {
  console.log("DEBUG - room:join -> ", socket.id)

  try {
    const { roomSlug, guest } = validate(joinSessionRoomSchema, input)
    const waitingRoom = await redis.hgetall<WaitingRoom>(`memory:session_rooms:${roomSlug}`)

    if (!waitingRoom) {
      SocketError.throw({
        key: "ROOM_NOT_FOUND",
        message: "Session room not found.",
        description: "Sorry, but the room you are trying to join has been closed."
      })
    }

    if (waitingRoom.status !== "waiting") {
      SocketError.throw({
        key: "SESSION_ALREADY_STARTED",
        message: "Session already started.",
        description: "Sorry, but the session has already been started in this room. Please try another."
      })
    }
    
    const joinedRoom: JoinedRoom = {
      ...waitingRoom,
      status: "joined",
      owner: { ...waitingRoom.owner, ready: false },
      guest: { ...guest, ready: false }
    }
    
    await Promise.all([
      redis.hset(`memory:connections:${socket.id}`, socketPlayerConnection(socket.id, guest.id, roomSlug)),
      redis.hset(`memory:session_rooms:${roomSlug}`, joinedRoom)
    ])
  
    socket.join(roomSlug)
    socket.broadcast.to(roomSlug).emit("room:joined", {
      message: `${guest.tag} has connected to the room. Game will start soon...`,
      data: joinedRoom
    })

    response({
      success: true,
      message: "You have successfully joined the session room.",
      data: joinedRoom
    })
  } catch (err) {
    console.error(err)
    response({
      success: false,
      message: "Failed to join waiting room.",
      error: SocketError.parser(err),
      data: null
    })
  }
}
