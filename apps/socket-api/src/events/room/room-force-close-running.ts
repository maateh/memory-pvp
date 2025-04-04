// types
import type { RunningRoom } from "@repo/schema/room"

// redis
import { closeRunningRoom } from "@repo/server/redis-commands"
import { getRoom } from "@repo/server/redis-commands-throwable"

// schemas
import { runningRoom } from "@repo/schema/room"

// server
import { io } from "@/server"

// error
import { ServerError } from "@repo/server/error"

export const roomForceCloseRunning: SocketEventHandler = (socket) => async (_, response) => {
  const { playerId, playerTag, roomSlug } = socket.ctx.connection

  try {
    const room = await getRoom<RunningRoom>(roomSlug, runningRoom)

    if (room.status !== "running" && room.status !== "cancelled") {
      ServerError.throw({
        thrownBy: "SOCKET_API",
        key: "ROOM_STATUS_CONFLICT",
        message: "Failed to force close session.",
        description: "You can only force close session in a room if the status is running or cancelled."
      })
    }

    await closeRunningRoom(room, "FORCE_CLOSED", {
      requesterPlayerId: playerId,
      applyPenalty: true
    })
    socket.ctx.connection = undefined!

    io.to(roomSlug).emit("room:force_closed:running", {
      message: `Session has been force closed by ${playerTag}.`,
      description: room.session.mode === "CASUAL"
        ? "This will not affect your Elo points."
        : "Requester player will lose Elo based on the session state."
    } satisfies SocketResponse)

    response({ message: "Running room closed." })
  } catch (err) {
    response({
      message: "Failed to force close session.",
      error: ServerError.parser(err)
    })
  }
}
