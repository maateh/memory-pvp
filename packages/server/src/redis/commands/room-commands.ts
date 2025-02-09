// types
import type { SessionRoom, RoomVariants } from "@repo/schema/session-room"

// redis
import { redis } from "@/redis/redis"
import { roomKey } from "@/redis/keys"

// utils
import { ServerError } from "@/error/error"

export async function getSessionRoom<R extends RoomVariants = SessionRoom>(
  roomSlug: string
) {
  const room = await redis.json.get<R>(roomKey(roomSlug))
  if (room) return room

  ServerError.throw({
    type: "REDIS",
    key: "ROOM_NOT_FOUND",
    message: "Session room not found.",
    description: "Sorry, but this room has been closed."
  })
}

export async function getSessionRoomByField<R extends RoomVariants, F extends keyof R>(
  roomSlug: string,
  field: F
) {
  const fieldValue = await redis.json.get<R[F]>(roomKey(roomSlug), `$.${field as string}`)
  if (fieldValue) return fieldValue as R[F]

  ServerError.throw({
    type: "REDIS",
    key: "ROOM_NOT_FOUND",
    message: "Session room not found.",
    description: "Sorry, but this room has been closed."
  })
}
