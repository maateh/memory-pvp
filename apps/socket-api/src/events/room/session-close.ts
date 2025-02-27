// types
import type { RunningRoom } from "@repo/schema/room"

// db
import { updateSessionStatus } from "@repo/server/db-session-mutation"

// redis
import { redis } from "@repo/server/redis"
import { getRoom } from "@repo/server/redis-commands-throwable"
import { playerConnectionKey, roomKey } from "@repo/server/redis-keys"

// helpers
import { reconnectionTimeExpired } from "@repo/helper/connection"

// utils
import { ServerError } from "@repo/server/error"

export const sessionClose: SocketEventHandler = (socket) => async (_, response) => {
  console.log("DEBUG - session:close -> ", socket.id)

  const { playerId, playerTag, roomSlug } = socket.ctx.connection
  socket.ctx.connection = undefined!

  try {
    const room = await getRoom<RunningRoom>(roomSlug)

    if (room.status !== "cancelled") {
      ServerError.throw({
        thrownBy: "SOCKET_API",
        key: "ROOM_STATUS_CONFLICT",
        message: "Failed to close session.",
        description: "You can only close session in a room if the status is cancelled."
      })
    }

    const otherPlayer = room.owner.id === playerId ? room.guest : room.owner
    if (
      room.session.type === "COMPETITIVE" &&
      !reconnectionTimeExpired(otherPlayer.connection)
    ) {
      ServerError.throw({
        thrownBy: "SOCKET_API",
        key: "ROOM_STATUS_CONFLICT",
        message: "Session cannot be closed right now.",
        description: "Please wait until the reconnection time of the disconnected player expires."
      })
    }

    await Promise.all([
      updateSessionStatus(room.session, playerId, "abandon"),
      redis.del(playerConnectionKey(room.owner.id)),
      redis.del(playerConnectionKey(room.guest.id)),
      redis.json.del(roomKey(roomSlug))
    ])

    response({
      message: `Session has been closed by ${playerTag}.`,
      description: room.session.type === "CASUAL"
        ? "Since this was a casual match it will not affect your ranking scores."
        : "Disconnected player will lose points based on the session state."
    })
  } catch (err) {
    console.log({err})
    response({
      message: "Failed to close session.",
      error: ServerError.parser(err)
    })
  }
}
