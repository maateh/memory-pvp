// types
import type { JoinedRoom, SessionRoom, WaitingRoom } from "@repo/schema/session-room"

// redis
import { redis } from "@/server/redis"

// config
import { roomKey, waitingRoomKey, waitingRoomsKey } from "@repo/config/redis-keys"

/**
 * TODO: write doc
 */
export async function getWaitingRooms() {
  // TODO: pagination support
  const roomSlugs = await redis.lrange(waitingRoomsKey, 0, 10)
  const rooms = await Promise.all(
    roomSlugs.map((slug) => redis.hgetall<WaitingRoom>(waitingRoomKey(slug)))
  ) as WaitingRoom[]

  return rooms
}

export async function getSessionRoom(roomSlug: string) {
  const room = await redis.hgetall<WaitingRoom>(waitingRoomKey(roomSlug))
  if (room) return room
  
  return await redis.hgetall<JoinedRoom | SessionRoom>(roomKey(roomSlug))
}
