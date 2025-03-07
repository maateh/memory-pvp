// types
import type { WaitingRoomVariants } from "@repo/schema/room"

// redis
import { closeRoom } from "@repo/server/redis-commands"
import { getRoom } from "@repo/server/redis-commands-throwable"

// error
import { ServerError } from "@repo/server/error"
import { getCurrentPlayerKey } from "@/utils/player"

export const roomClose: SocketEventHandler = (socket) => async (_, response) => {
  console.log("DEBUG - room:close -> ", socket.id)

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

    if (getCurrentPlayerKey(room.owner.id, playerId) === "guest") {
      ServerError.throw({
        thrownBy: "SOCKET_API",
        key: "ROOM_ACCESS_DENIED",
        message: "Failed to close room.",
        description: "You are only a guest of this room, so you cannot close it."
      })
    }

    await closeRoom(room, playerId)
    socket.ctx.connection = undefined!

    if (room.status !== "waiting") {
      socket.broadcast.to(roomSlug).emit("room:closed", {
        message: `${playerTag} has closed the room.`,
        description: "This will not affect your ranking scores."
      } satisfies SocketResponse)
    }

    socket.leave(roomSlug)
    response({
      message: "Session room has been successfully closed.",
      description: "This will not affect your ranking scores."
    })
  } catch (err) {
    response({
      message: "Failed to close room.",
      error: ServerError.parser(err)
    })
  }
}
