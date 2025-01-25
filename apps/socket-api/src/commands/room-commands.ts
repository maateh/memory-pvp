// types
import type { JoinedRoom, WaitingRoom, SessionRoom } from "@repo/schema/session-room"

// redis
import { redis } from "@repo/redis"
import { roomKey } from "@repo/redis/keys"

// utils
import { SocketError } from "@repo/types/socket-api-error"

export async function getSessionRoom<R extends WaitingRoom | JoinedRoom | SessionRoom = SessionRoom>(
  roomSlug: string
) {
  const room = await redis.hgetall<R>(roomKey(roomSlug))
  if (room) return room

  // TODO: remove player(s) connection data
  SocketError.throw({
    key: "ROOM_NOT_FOUND",
    message: "Session room not found.",
    description: "Sorry, but this room has been closed."
  })
}

export async function getSessionRoomByField<R extends WaitingRoom | JoinedRoom | SessionRoom, F extends R[keyof R]>(
  roomSlug: string,
  field: keyof R
) {
  const fieldValue = await redis.hget<F>(roomKey(roomSlug), field as string)
  if (fieldValue) return fieldValue

  // TODO: remove player(s) connection data
  SocketError.throw({
    key: "ROOM_NOT_FOUND",
    message: "Session room not found.",
    description: "Sorry, but this room has been closed."
  })
}
