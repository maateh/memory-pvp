// types
import type { PlayerConnection } from "@repo/schema/player-connection"

// db
import { db } from "@/server"

// redis
import { redis } from "@repo/server/redis"
import { playerConnectionKey } from "@repo/server/redis-keys"
import { onlinePlayer } from "@repo/server/util"

export const connectionLoader: SocketMiddlewareFn = async (socket, next) => {
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

    const onlineConnection = onlinePlayer(connection, socket.id)
    await redis.hset(playerConnectionKey(player.id), onlineConnection)

    socket.ctx = { ...ctx, clerkId, connection: onlineConnection }
    next()
  } catch (err) {
    console.error("Player connection error: ", err)
    // TODO: use `ServerError` instead
    return next(new Error("Something went wrong."))
  }
}
