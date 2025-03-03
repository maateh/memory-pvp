// types
import type { RoomVariants, WaitingRoom } from "@repo/schema/room"

// redis
import { redis } from "../redis"
import { playerConnectionKey, roomKey, waitingRoomsKey } from "../keys"

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
 * Retrieves the active room associated with a player's connection.
 * 
 * - Fetches the `roomSlug` from Redis using the player's connection key.
 * - If a `roomSlug` exists, retrieves the full room data using `getRoom`.
 * - Returns `null` if the player is not associated with any active room.
 *
 * @param {string} playerId - The unique identifier of the player.
 * @returns {Promise<R | null>} - The room data if the player is in an active room, otherwise `null`.
 */
export async function getActiveRoom<R extends RoomVariants>(
  playerId: string
): Promise<R | null> {
  const roomSlug = await redis.hget<string>(playerConnectionKey(playerId), "roomSlug")
  if (!roomSlug) return null

  return await getRoom(roomSlug)
}

/**
 * Retrieves a specific room from Redis based on its slug.
 * 
 * - Attempts to fetch the room data from Redis using `json.get`.
 * - If the room is found, it is returned.
 * - If the room is not found, a `ServerError` is thrown indicating that the session room has been closed.
 * 
 * @param {string} roomSlug - The unique identifier of the room to fetch.
 * @returns {Promise<R | null>} - The requested room data or null if not found.
 */
export async function getRoom<R extends RoomVariants = RoomVariants>(
  roomSlug: string
): Promise<R | null> {
  return await redis.json.get<R>(roomKey(roomSlug))
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
 * @returns {Promise<R[F] | null>} - The value of the specified field or null if not found.
 */
export async function getRoomByField<R extends RoomVariants = RoomVariants, F extends keyof R = keyof R>(
  roomSlug: string,
  field: F
): Promise<R[F] | null> {
  return await redis.json.get<R[F]>(
    roomKey(roomSlug), `$.${field as string}`
  )
}
