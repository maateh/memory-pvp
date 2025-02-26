// types
import type { PlayerConnection } from "@repo/schema/player-connection"

// db
import { db } from "@repo/server/db"

// redis
import { redis } from "@repo/server/redis"
import { playerConnectionKey } from "@repo/server/redis-keys"

// utils
import { ServerError } from "@repo/server/error"
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
      ServerError.throw({
        thrownBy: "SOCKET_API",
        key: "PLAYER_PROFILE_NOT_FOUND",
        message: "Player profile not found.",
        description: "Please create a player profile first."
      })
    }

    const connection = await redis.hgetall<PlayerConnection>(playerConnectionKey(player.id))

    if (!connection) {
      ServerError.throw({
        thrownBy: "SOCKET_API",
        key: "PLAYER_CONNECTION_NOT_FOUND",
        message: "Player connection data not found.",
        description: "Please try creating or joining a new room."
      })
    }

    const onlineConnection = onlinePlayer(connection, socket.id)
    await redis.hset(playerConnectionKey(player.id), onlineConnection)

    socket.ctx = { ...ctx, clerkId, connection: onlineConnection }
    next()
  } catch (err) {
    return next(ServerError.asSocketError(err))
  }
}
