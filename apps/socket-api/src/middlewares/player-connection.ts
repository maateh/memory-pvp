// types
import type { PlayerConnection } from "@repo/server/socket-types"

// db
import { db } from "@/server"

// redis
import { redis } from "@repo/server/redis"
import { playerConnectionKey } from "@repo/server/redis-keys"

export const playerConnection: SocketMiddlewareFn = async (socket, next) => {
  const { clerkId, ...ctx } = socket.ctx || {}

  try {
    const player = await db.playerProfile.findFirst({
      where: {
        user: { clerkId },
        isActive: true
      }
    })
  
    if (!player) {
      return next(new Error("Player profile not found."))
    }

    const connection = await redis.hgetall<PlayerConnection>(playerConnectionKey(player.id))

    if (!connection) {
      return next(new Error("Player connection not found."))
    }

    socket.ctx = { ...ctx, clerkId, connection }
    next()
  } catch (err) {
    console.error("Player connection error: ", err)
    // TODO: use `ServerError` instead
    return next(new Error("Something went wrong."))
  }
}
