// types
import type { JoinSessionRoomValidation } from "@repo/schema/session-room-validation"
import type { JoinedRoom } from "@repo/schema/session-room"

// redis
import { redis } from "@/redis"
import { getWaitingRoom } from "@/redis/room-commands"

// config
import { connectionKey, playerConnectionKey, roomKey, waitingRoomKey, waitingRoomsKey } from "@repo/config/redis-keys"

// schema
import { joinSessionRoomValidation } from "@repo/schema/session-room-validation"

// error
import { SocketError } from "@repo/types/socket-api-error"

// utils
import { socketPlayerConnection } from "@/utils/socket-player-connection"
import { validate } from "@/utils/validate"

export const roomJoin: SocketEventHandler<
  JoinSessionRoomValidation,
  JoinedRoom
> = (socket) => async (input, response) => {
  console.log("DEBUG - room:join -> ", socket.id)

  // FIXME: check if the user isn't already joined in other session

  try {
    const { roomSlug, guest } = validate(joinSessionRoomValidation, input)
    const waitingRoom = await getWaitingRoom(roomSlug)
    
    const joinedRoom: JoinedRoom = {
      ...waitingRoom,
      status: "joined",
      guest: {
        ...guest,
        socketId: socket.id,
        ready: false
      }
    }

    const connection = socketPlayerConnection(socket.id, guest.id, roomSlug)
    await Promise.all([
      redis.hset(connectionKey(socket.id), connection),
      redis.hset(playerConnectionKey(guest.id), connection),
      redis.hset(roomKey(roomSlug), joinedRoom),
      redis.del(waitingRoomKey(roomSlug)),
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
