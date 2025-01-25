// types
import type { WaitingRoom } from "@repo/schema/session-room"
import type { CreateSessionRoomValidation } from "@repo/schema/session-room-validation"

// redis
import { redis } from "@repo/redis"
import { connectionKey, roomKey } from "@repo/redis/keys"

// schema
import { createSessionRoomValidation } from "@repo/schema/session-room-validation"

// error
import { SocketError } from "@repo/types/socket-api-error"

// helpers
import { generateSessionSlug } from "@repo/helper/session"

// utils
import { socketPlayerConnection } from "@/utils/socket-player-connection"
import { validate } from "@/utils/validate"

export const roomCreate: SocketEventHandler<
  CreateSessionRoomValidation,
  WaitingRoom
> = (socket) => async (input, response) => {
  console.log("DEBUG - room:create -> ", socket.id)

  try {
    const { owner, settings } = validate(createSessionRoomValidation, input)
    const slug = generateSessionSlug({ type: settings.type, mode: settings.mode })

    const waitingRoom: WaitingRoom = {
      status: "waiting",
      slug,
      owner: {
        ...owner,
        socketId: socket.id,
        ready: false
      },
      settings,
      createdAt: new Date()
    }

    await Promise.all([
      redis.hset(connectionKey(socket.id), socketPlayerConnection(socket.id, owner.id, slug)),
      redis.hset(roomKey(slug), waitingRoom)
    ])

    socket.join(slug)
    response({
      success: true,
      message: "Waiting for another user to join...",
      data: waitingRoom
    })
  } catch (err) {
    response({
      success: false,
      message: "Failed to create waiting room.",
      error: SocketError.parser(err),
      data: null
    })
  }
}
