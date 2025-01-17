// types
import type { WaitingRoom } from "@repo/schema/session-room"
import type { CreateSessionRoomValidation } from "@repo/schema/session-room-validation"

// redis
import { redis } from "@repo/redis"

// schema
import { createSessionRoomValidation } from "@repo/schema/session-room-validation"

// error
import { SocketError } from "@repo/types/socket-api-error"

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
    const slug = "session_slug" // TODO: move `generateSessionSlug()` helper to a shared package

    const waitingRoom: WaitingRoom = {
      status: "waiting",
      slug,
      owner: { ...owner, ready: false },
      settings,
      createdAt: new Date()
    }

    await Promise.all([
      redis.hset(`memory:connections:${socket.id}`, socketPlayerConnection(socket.id, owner.id, slug)),
      redis.hset(`memory:session_rooms:${waitingRoom.slug}`, waitingRoom)
    ])

    socket.join(waitingRoom.slug)
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
