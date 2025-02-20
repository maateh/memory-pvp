// types
import type { RoomVariants, WaitingRoom } from "@repo/schema/room"

// redis
import { redis } from "../redis"
import { roomKey, waitingRoomsKey } from "../keys"

// utils
import { ServerError } from "../../error/error"

/**
 * Retrieves a list of waiting rooms from Redis.
 * 
 * Note: Pagination will be added later.
 * 
 * @returns {Promise<WaitingRoom[]>} - A list of waiting rooms.
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
 * Retrieves a specific room from Redis based on its slug.
 * 
 * - Attempts to fetch the room data from Redis using `json.get`.
 * - If the room is found, it is returned.
 * - If the room is not found, a `ServerError` is thrown indicating that the session room has been closed.
 * 
 * @param {string} roomSlug - The unique identifier of the room to fetch.
 * @returns {Promise<R>} - The requested room data.
 * @throws {ServerError} - If the room is not found in Redis.
 */
export async function getRoom<R extends RoomVariants = RoomVariants>(
  roomSlug: string
): Promise<R> {
  const room = await redis.json.get<R>(roomKey(roomSlug))
  if (room) return room

  ServerError.throw({
    thrownBy: "REDIS",
    key: "ROOM_NOT_FOUND",
    message: "Session room not found.",
    description: "Sorry, but this room has been closed."
  })
}

/**
 * Retrieves a specific field from a room stored in Redis.
 * 
 * - Fetches the value of the specified field from the room data using `json.get`.
 * - If the field exists, it is returned.
 * - If the field is not found or the room does not exist, a `ServerError` is thrown.
 * 
 * @template R - The room variant type.
 * @template F - The key of the field to retrieve from the room.
 * 
 * @param {string} roomSlug - The unique identifier of the room.
 * @param {F} field - The field key to retrieve from the room data.
 * @returns {Promise<R[F]>} - The value of the specified field.
 * @throws {ServerError} - If the room is not found in Redis.
 */
export async function getRoomByField<R extends RoomVariants = RoomVariants, F extends keyof R = keyof R>(
  roomSlug: string,
  field: F
): Promise<R[F]> {
  const fieldValue = await redis.json.get<R[F]>(roomKey(roomSlug), `$.${field as string}`)
  if (fieldValue) return fieldValue

  ServerError.throw({
    thrownBy: "REDIS",
    key: "ROOM_NOT_FOUND",
    message: "Session room not found.",
    description: "Sorry, but this room has been closed."
  })
}
