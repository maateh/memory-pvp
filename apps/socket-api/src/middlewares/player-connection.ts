// types
import type { PlayerConnection } from "@repo/server/socket-types"

// db
import { db } from "@/server"

// redis
import { redis } from "@repo/server/redis"
import { playerConnectionKey } from "@repo/server/redis-keys"

export const playerConnection: SocketMiddlewareFn = async (socket, next) => {
  try {
    const player = await db.playerProfile.findFirst({
      where: {
        user: { clerkId: socket.clerkId },
        isActive: true
      }
    })
  
    if (!player) {
      return next(new Error("Active player not found."))
    }

    const connection = await redis.hgetall<PlayerConnection>(playerConnectionKey(player.id))

    if (!connection) {
      return next(new Error("Player connection not found."))
    }

    socket.connection = connection
    next()
  } catch (err) {
    console.error("Player connection error: ", err)
    return next(new Error("Active player profile or player connection not found!"))
  }
}
