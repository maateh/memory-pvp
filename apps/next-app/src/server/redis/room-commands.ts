// types
import type { JoinedRoom, SessionRoom, WaitingRoom } from "@repo/schema/session-room"

// redis
import { redis } from "@/server/redis"

// config
import { roomKey, waitingRoomsKey } from "@repo/config/redis-keys"

/**
 * TODO: write doc
 * 
 * @returns 
 */
export async function getWaitingRooms(): Promise<WaitingRoom[]> {
  // TODO: pagination support
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
