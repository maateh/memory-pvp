// types
import type { RoomVariants } from "@repo/schema/room"

// redis
import { redis } from "@repo/server/redis"
import { roomKey, waitingRoomsKey } from "@repo/server/redis-keys"

export const roomLoader: SocketMiddlewareFn = async (socket, next) => {
  const { connection, ...ctx } = socket.ctx || {}

  try {
    if (!connection) {
      return next(new Error("Player connection not found."))
    }

    const { playerId, roomSlug } = connection
    const room = await redis.json.get<RoomVariants>(roomKey(roomSlug))

    if (!room) {
      return next(new Error("Room data not found."))
    }

    // TODO: check if the player is in the room (owner or guest)
    //  - if not -> return next(error)

    if (room.status === "waiting") {
      room.owner.connection = connection
      room.owner.ready = false
    }
  
    if (room.status === "joined" || room.status === "ready") {
      const currentPlayerKey: "owner" | "guest" = room.owner.id === playerId ? "owner" : "guest"
      room[currentPlayerKey].connection = connection
      
      room.status = "joined"
      room.owner.ready = false
      room.guest.ready = false
    }
  
    // TODO: if room.status === "starting" || room.status === "running"
    //  -> implement session reconnection

    await Promise.all([
      redis.json.set(roomKey(room.slug), `$`, room, { xx: true }),
      room.status !== "waiting" ? redis.lrem(waitingRoomsKey, 1, room.slug) : null
    ])

    socket.ctx = { ...ctx, connection, room }
    next()
  } catch (err) {
    console.error("Player connection error: ", err)
    // TODO: use `ServerError` instead
    return next(new Error("Something went wrong."))
  }
}
