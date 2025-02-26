// types
import type { RunningRoom } from "@repo/schema/room"

// db
import { updateSessionStatus } from "@repo/server/db-session-mutation"

// redis
import { redis } from "@repo/server/redis"
import { getRoom } from "@repo/server/redis-commands-throwable"
import { playerConnectionKey, roomKey } from "@repo/server/redis-keys"

// server
import { io } from "@/server"

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

    if (room.session.type === "COMPETITIVE") {
      // TODO: implement closing "COMPETITIVE" game sessions
      //  - More information at "/events/_disconnect"

      ServerError.throw({
        thrownBy: "SOCKET_API",
        key: "ROOM_STATUS_CONFLICT",
        message: "(WIP) Failed to close session.",
        description: "You cannot close competitive multiplayer sessions right now."
      })
    }

    await Promise.all([
      updateSessionStatus(room.session, playerId, "abandon"),
      redis.del(playerConnectionKey(room.owner.id)),
      redis.del(playerConnectionKey(room.guest.id)),
      redis.json.del(roomKey(roomSlug))
    ])

    io.to(roomSlug).emit("session:closed", {
      message: `Session has been closed by ${playerTag}.`,
      description: room.session.type === "CASUAL"
        ? "Since this was a casual match it will not affect your ranking scores."
        : "Disconnected player will lose points based on the session state."
    } satisfies SocketResponse)
  } catch (err) {
    response({
      message: "Failed to close session.",
      error: ServerError.parser(err)
    })
  }
}
