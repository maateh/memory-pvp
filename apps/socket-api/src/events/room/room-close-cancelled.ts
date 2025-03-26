// types
import type { RunningRoom } from "@repo/schema/room"

// redis
import { closeRunningRoom } from "@repo/server/redis-commands"
import { getRoom } from "@repo/server/redis-commands-throwable"

// schemas
import { runningRoom } from "@repo/schema/room"

// error
import { ServerError } from "@repo/server/error"

// helpers
import { reconnectionTimeExpired } from "@repo/helper/connection"
import { otherPlayerKey } from "@repo/helper/player"

export const roomCloseCancelled: SocketEventHandler = (socket) => async (_, response) => {
  console.log("DEBUG - room:close:cancelled -> ", socket.id)

  const { playerId, playerTag, roomSlug } = socket.ctx.connection

  try {
    const room = await getRoom<RunningRoom>(roomSlug, runningRoom)

    if (room.status !== "cancelled") {
      ServerError.throw({
        thrownBy: "SOCKET_API",
        key: "ROOM_STATUS_CONFLICT",
        message: "Failed to close session.",
        description: "You can only close session in a room if the status is cancelled."
      })
    }

    const otherPlayer = room[otherPlayerKey(room.owner.id, playerId)]
    if (
      room.session.mode === "RANKED" &&
      !reconnectionTimeExpired(otherPlayer.connection)
    ) {
      ServerError.throw({
        thrownBy: "SOCKET_API",
        key: "ROOM_STATUS_CONFLICT",
        message: "Session cannot be closed right now.",
        description: "Please wait until the reconnection time of the disconnected player expires."
      })
    }

    await closeRunningRoom(room, "CLOSED", {
      requesterPlayerId: otherPlayer.id,
      applyPenalty: true
    })
    socket.ctx.connection = undefined!

    response({
      message: `Session has been closed by ${playerTag}.`,
      description: room.session.mode === "CASUAL"
        ? "This will not affect your Elo points."
        : "Disconnected player will lose Elo based on the session state."
    })
  } catch (err) {
    response({
      message: "Failed to close session.",
      error: ServerError.parser(err)
    })
  }
}
