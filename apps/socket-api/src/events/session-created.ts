// types
import type { JoinedRoom, SessionRoom } from "@repo/schema/session-room"
import type { SessionCreatedValidation } from "@repo/schema/session-room-validation"

// schema
import { sessionCreatedValidation } from "@repo/schema/session-room-validation"

// config
import { roomKey } from "@repo/config/redis-keys"

// redis
import { redis } from "@/redis"
import { getSessionRoom } from "@/redis/room-commands"

// utils
import { SocketError } from "@repo/types/socket-api-error"
import { validate } from "@/utils/validate"

export const sessionCreated: SocketEventHandler<
  SessionCreatedValidation,
  SessionRoom
> = (socket) => async (input, response) => {
  console.log("session:created ->", socket.id)

  try {
    const { session } = validate(sessionCreatedValidation, input)
    const joinedRoom = await getSessionRoom<JoinedRoom>(session.slug)

    const room: SessionRoom = {
      ...joinedRoom,
      status: "running",
      session
    }

    await redis.hset(roomKey(session.slug), room)

    // TODO: formatting helpers would be cool here
    // (which are currently only used in the client-side)
    const { type, mode, tableSize } = joinedRoom.settings

    // TODO: might be better broadcasting to everyone -> `io.to`   
    socket.broadcast.to(session.slug).emit("session:started", {
      message: "The game session has started!",
      description: `${type} | ${mode} | ${tableSize}`,
      data: room
    } satisfies SocketResponse<SessionRoom>)
    
    response({
      message: "The game session has started!",
      description: `${type} | ${mode} | ${tableSize}`,
      data: room
    })
  } catch (err) {
    response({
      message: "Failed to start game session.",
      error: SocketError.parser(err)
    })
  }
}
