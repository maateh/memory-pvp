// types
import type { WaitingRoomVariants } from "@repo/schema/room"

// redis
import { closeWaitingRoom } from "@repo/server/redis-commands"
import { getRoom } from "@repo/server/redis-commands-throwable"

// error
import { ServerError } from "@repo/server/error"

// helper
import { currentPlayerKey } from "@repo/helper/player"

export const roomCloseWaiting: SocketEventHandler = (socket) => async (_, response) => {
  console.log("DEBUG - room:close:waiting -> ", socket.id)

  const { playerId, playerTag, roomSlug } = socket.ctx.connection

  try {
    const room = await getRoom<WaitingRoomVariants>(roomSlug)
  
    if (room.status !== "waiting" && room.status !== "joined") {
      ServerError.throw({
        thrownBy: "SOCKET_API",
        key: "ROOM_STATUS_CONFLICT",
        message: "Failed to close room.",
        description: "You can only close room if the status is waiting."
      })
    }

    if (currentPlayerKey(room.owner.id, playerId) === "guest") {
      ServerError.throw({
        thrownBy: "SOCKET_API",
        key: "ROOM_ACCESS_DENIED",
        message: "Failed to close room.",
        description: "You are only a guest of this room, so you cannot close it."
      })
    }

    await closeWaitingRoom(room, playerId)
    socket.ctx.connection = undefined!

    if (room.status !== "waiting") {
      socket.broadcast.to(roomSlug).emit("room:closed", {
        message: `${playerTag} has closed the room.`,
        description: "This will not affect your Elo points."
      } satisfies SocketResponse)
    }

    socket.leave(roomSlug)
    response({
      message: "Session room has been successfully closed.",
      description: "This will not affect your Elo points."
    })
  } catch (err) {
    response({
      message: "Failed to close room.",
      error: ServerError.parser(err)
    })
  }
}
