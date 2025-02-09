// types
import type { JoinSessionRoomValidation } from "@repo/schema/session-room-validation"
import type { JoinedRoom, WaitingRoom } from "@repo/schema/session-room"

// redis
import { redis } from "@/redis"
import { getSessionRoom } from "@/redis/room-commands"

// config
import { connectionKey, playerConnectionKey, roomKey, waitingRoomsKey } from "@repo/config/redis-keys"
import { socketConnection } from "@repo/config/redis-data-parser"

// schema
import { joinSessionRoomValidation } from "@repo/schema/session-room-validation"

// error
import { SocketError } from "@repo/types/socket-api-error"

// utils
import { validate } from "@/utils/validate"

// FIXME: implement this event as a SERVER ACTION
export const roomJoin: SocketEventHandler<
  JoinSessionRoomValidation,
  JoinedRoom
> = (socket) => async (input, response) => {
  console.log("DEBUG - room:join -> ", socket.id)

  // FIXME: check if the user hasn't already joined in other session

  try {
    const { roomSlug, guest } = validate(joinSessionRoomValidation, input)
    const waitingRoom = await getSessionRoom<WaitingRoom>(roomSlug)
    
    const joinedRoom: JoinedRoom = {
      ...waitingRoom,
      status: "joined",
      guest: {
        ...guest,
        status: "online",
        socketId: socket.id,
        ready: false
      }
    }

    const connection = socketConnection(socket.id, guest.id, roomSlug)
    await Promise.all([
      redis.hset(connectionKey(socket.id), connection),
      redis.hset(playerConnectionKey(guest.id), connection),
      redis.json.set(roomKey(roomSlug), "$", joinedRoom, { xx: true }),
      redis.lrem(waitingRoomsKey, 1, roomSlug)
    ])
  
    const responseBody: Omit<SocketResponse<JoinedRoom>, 'message'> = {
      description: "Change your status to ready if you want to start playing.",
      data: joinedRoom
    }

    socket.join(roomSlug)
    socket.broadcast.to(roomSlug).emit("room:joined", {
      message: `${guest.tag} has connected to the room.`,
      ...responseBody
    } satisfies SocketResponse<JoinedRoom>)

    response({
      message: "You have successfully joined to the session room.",
      ...responseBody
    })
  } catch (err) {
    console.error(err)
    response({
      message: "Failed to join waiting room.",
      error: SocketError.parser(err)
    })
  }
}
