// types
import type { WaitingRoom } from "@repo/schema/session-room"
import type { CreateSessionRoomValidation } from "@repo/schema/session-room-validation"

// redis
import { redis } from "@/redis"

// config
import { connectionKey, playerConnectionKey, roomKey, waitingRoomsKey } from "@repo/config/redis-keys"
import { socketConnection } from "@repo/config/redis-data-parser"

// schema
import { createSessionRoomValidation } from "@repo/schema/session-room-validation"

// error
import { SocketError } from "@repo/types/socket-api-error"

// helpers
import { generateSessionSlug } from "@repo/helper/session"

// utils
import { validate } from "@/utils/validate"

// FIXME: implement this event as a SERVER ACTION
export const roomCreate: SocketEventHandler<
  CreateSessionRoomValidation,
  WaitingRoom
> = (socket) => async (input, response) => {
  console.log("DEBUG - room:create -> ", socket.id)

  // FIXME: check if the user hasn't already joined in other session

  try {
    const { owner, ...settings } = validate(createSessionRoomValidation, input)
    const slug = generateSessionSlug({ type: settings.type, mode: settings.mode })

    const waitingRoom: WaitingRoom = {
      status: "waiting",
      slug,
      owner: {
        ...owner,
        status: "online",
        socketId: socket.id,
        ready: false
      },
      settings,
      createdAt: new Date()
    }

    const connection = socketConnection(socket.id, owner.id, slug)
    await Promise.all([
      redis.hset(connectionKey(socket.id), connection),
      redis.hset(playerConnectionKey(owner.id), connection),
      redis.json.set(roomKey(slug), "$", waitingRoom),
      redis.lpush(waitingRoomsKey, slug)
    ])

    socket.join(slug)
    response({
      message: "Session room successfully created!",
      description: "Waiting for another user to join...",
      data: waitingRoom
    })
  } catch (err) {
    response({
      message: "Failed to create waiting room.",
      error: SocketError.parser(err)
    })
  }
}
