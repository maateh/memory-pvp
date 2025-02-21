// types
import type { RoomVariants } from "@repo/schema/room"

// redis
import {
  getRoom as getRoom_unthrowable,
  getRoomByField as getRoomByField_unthrowable
} from "../room-commands"

// utils
import { ServerError } from "../../../error/error"

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
  const room = await getRoom_unthrowable<R>(roomSlug)
  if (room) return room

  ServerError.throw({
    thrownBy: "REDIS",
    key: "ROOM_NOT_FOUND",
    message: "Room not found.",
    description: "Sorry, but this room is probably already closed."
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
  const fieldValue = await getRoomByField_unthrowable<R, F>(roomSlug, field)
  if (fieldValue) return fieldValue

  ServerError.throw({
    thrownBy: "REDIS",
    key: "ROOM_NOT_FOUND",
    message: "Room not found.",
    description: "Sorry, but this room is probably already closed."
  })
}
