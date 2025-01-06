import z from "zod"

// types
import type { ClientPlayer } from "@repo/schema/player"
import type { CreateSessionValidation } from "@repo/schema/session-validation"

// redis
import { redis } from "@repo/redis"

// schema
import { clientPlayerSchema } from "@repo/schema/player"
import { createSessionSchema } from "@repo/schema/session-validation"

// error
import { SocketError } from "@/error/socket-error"

// utils
import { validate } from "@/utils/validate"

const createRoomSchema = z.object({ // TODO: move this to `@repo/schema` package
  owner: clientPlayerSchema,
  settings: createSessionSchema
})

type RoomCreateValidation = z.infer<typeof createRoomSchema> // TODO: move this to `@repo/schema` package

type SocketPlayerConnection = ClientPlayer & { // TODO: move this type into a shared `@repo/types` package
  socketId: string
  roomSlug: string
  createdAt: Date
}

type WaitingRoom = { // TODO: move this type into a shared `@repo/types` package
  slug: string
  status: "waiting"
  owner: ClientPlayer & { socketId: string }
  settings: CreateSessionValidation
  createdAt: Date
}

export const roomCreate: SocketEventHandler<
  RoomCreateValidation,
  WaitingRoom
> = (socket) => async (input, response) => {
  console.info("DEBUG - room:create -> ", socket.id)

  try {
    const { owner, settings } = validate(createRoomSchema, input)

    const room: WaitingRoom = {
      slug: "TODO: generate session slug",
      status: "waiting",
      owner: { ...owner, socketId: socket.id },
      settings: settings,
      createdAt: new Date()
    }
  
    const connection: SocketPlayerConnection = {
      ...owner,
      socketId: socket.id,
      roomSlug: room.slug,
      createdAt: room.createdAt
    }

    await Promise.all([
      redis.hset(`memory:connections:${socket.id}`, connection),
      redis.hset(`memory:session_rooms:${room.slug}`, room)
    ])

    socket.join(room.owner.socketId)
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
