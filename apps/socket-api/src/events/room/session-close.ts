// types
import type { RunningRoom } from "@repo/schema/room"

// redis
import { closeSession } from "@repo/server/redis-commands"
import { getRoom } from "@repo/server/redis-commands-throwable"

// schemas
import { runningRoomSchema } from "@repo/schema/room"

// error
import { ServerError } from "@repo/server/error"

// helpers
import { reconnectionTimeExpired } from "@repo/helper/connection"
import { otherPlayerKey } from "@repo/helper/player"

export const sessionClose: SocketEventHandler = (socket) => async (_, response) => {
  console.log("DEBUG - session:close -> ", socket.id)

  const { playerId, playerTag, roomSlug } = socket.ctx.connection

  try {
    const room = await getRoom<RunningRoom>(roomSlug, runningRoomSchema)

    if (room.status !== "cancelled") {
      ServerError.throw({
        thrownBy: "SOCKET_API",
        key: "ROOM_STATUS_CONFLICT",
        message: "Failed to close session.",
        description: "You can only close session in a room if the status is cancelled."
      })
    }

    const playerKey = otherPlayerKey(room.owner.id, playerId)
    if (
      room.session.mode === "RANKED" &&
      !reconnectionTimeExpired(room[playerKey].connection)
    ) {
      ServerError.throw({
        thrownBy: "SOCKET_API",
        key: "ROOM_STATUS_CONFLICT",
        message: "Session cannot be closed right now.",
        description: "Please wait until the reconnection time of the disconnected player expires."
      })
    }

    await closeSession(room, playerId, "CLOSED")
    socket.ctx.connection = undefined!

    response({
      message: `Session has been closed by ${playerTag}.`,
      description: room.session.mode === "CASUAL"
        ? "Since this was a casual match it will not affect your ranking scores."
        : "Disconnected player will lose points based on the session state."
    })
  } catch (err) {
    response({
      message: "Failed to close session.",
      error: ServerError.parser(err)
    })
  }
}
