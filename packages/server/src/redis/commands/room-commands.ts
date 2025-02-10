// types
import type { RoomVariants, WaitingRoom } from "@repo/schema/session-room"

// redis
import { redis } from "../redis"
import { roomKey, waitingRoomsKey } from "../keys"

// utils
import { ServerError } from "../../error/error"

/**
 * TODO: write doc
 * 
 * @returns 
 */
export async function getWaitingRooms(): Promise<WaitingRoom[]> {
  // TODO: add pagination support
  const roomSlugs = await redis.lrange(waitingRoomsKey, 0, 10)  
  if (roomSlugs.length === 0) return []

  const roomKeys = roomSlugs.map((slug) => roomKey(slug))

  /*
   * Note: I don't know why, but `json.mget` gives back every data
   * inside a nested array, so I have to do a `flatMap` on it.
   */
  const rooms = await redis.json.mget<WaitingRoom[][]>(roomKeys, "$")
  return rooms.flatMap((room) => room)
}

/**
 * TODO: write doc
 * 
 * @param roomSlug 
 * @returns 
 */
export async function getRoom<R extends RoomVariants = RoomVariants>(
  roomSlug: string
): Promise<R> {
  const room = await redis.json.get<R>(roomKey(roomSlug))
  if (room) return room

  ServerError.throw({
    type: "REDIS",
    key: "ROOM_NOT_FOUND",
    message: "Session room not found.",
    description: "Sorry, but this room has been closed."
  })
}

/**
 * TODO: write doc
 * 
 * @param roomSlug 
 * @param field 
 * @returns 
 */
export async function getRoomByField<R extends RoomVariants = RoomVariants, F extends keyof R = keyof R>(
  roomSlug: string,
  field: F
): Promise<R[F]> {
  const fieldValue = await redis.json.get<R[F]>(roomKey(roomSlug), `$.${field as string}`)
  if (fieldValue) return fieldValue

  ServerError.throw({
    type: "REDIS",
    key: "ROOM_NOT_FOUND",
    message: "Session room not found.",
    description: "Sorry, but this room has been closed."
  })
}
