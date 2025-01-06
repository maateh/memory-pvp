// types
import type { WaitingRoom } from "@repo/schema/session-room"
import type { CreateSessionRoomValidation } from "@repo/schema/session-room-validation"

// redis
import { redis } from "@repo/redis"

// schema
import { createSessionRoomSchema } from "@repo/schema/session-room-validation"

// error
import { SocketError } from "@/error/socket-error"

// utils
import { validate } from "@/utils/validate"

type SocketPlayerConnection = {
  socketId: string
  playerId: string
  roomSlug: string
  createdAt: Date
}

export const roomCreate: SocketEventHandler<
  CreateSessionRoomValidation,
  WaitingRoom
> = (socket) => async (input, response) => {
  console.info("DEBUG - room:create -> ", socket.id)

  try {
    const { owner, settings } = validate(createSessionRoomSchema, input)
    const slug = "session_slug" // TODO: move `generateSessionSlug()` helper to a shared package

    const room: WaitingRoom = {
      status: "waiting",
      slug,
      owner,
      settings,
      createdAt: new Date()
    }
  
    const connection: SocketPlayerConnection = {
      socketId: socket.id,
      playerId: owner.id,
      roomSlug: room.slug,
      createdAt: room.createdAt
    }

    await Promise.all([
      redis.hset(`memory:connections:${socket.id}`, connection),
      redis.hset(`memory:session_rooms:${room.slug}`, room)
    ])

    socket.join(room.slug)
    response({
      success: true,
      message: "Waiting for another user to join...",
      data: room
    })
  } catch (err) {
    console.error(err)
    response({
      success: false,
      message: "Failed to create waiting room.",
      error: SocketError.parser(err),
      data: null
    })
  }
}
