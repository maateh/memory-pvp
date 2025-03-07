// types
import type { WaitingRoom, WaitingRoomVariants } from "@repo/schema/room"

// redis
import { leaveRoom } from "@repo/server/redis-commands"
import { getRoom } from "@repo/server/redis-commands-throwable"

// error
import { ServerError } from "@repo/server/error"

// helpers
import { currentPlayerKey } from "@repo/helper/player"

export const roomLeave: SocketEventHandler = (socket) => async (_, response) => {
  console.log("DEBUG - room:leave -> ", socket.id)

  const { playerId, playerTag, roomSlug } = socket.ctx.connection

  try {
    const room = await getRoom<WaitingRoomVariants>(roomSlug)

    if (room.status !== "waiting" && room.status !== "joined") {
      ServerError.throw({
        thrownBy: "SOCKET_API",
        key: "ROOM_STATUS_CONFLICT",
        message: "Failed to leave room.",
        description: "You can only leave room if the status is waiting."
      })
    }

    if (currentPlayerKey(room.owner.id, playerId) === "owner") {
      ServerError.throw({
        thrownBy: "SOCKET_API",
        key: "ROOM_ACCESS_DENIED",
        message: "Failed to leave room.",
        description: "As the owner of this room, you can only close it."
      })
    }

    const waitingRoom = await leaveRoom(room, playerId)
    socket.ctx.connection = undefined!

    socket.leave(roomSlug)
    socket.broadcast.to(roomSlug).emit("room:left", {
      message: `${playerTag} has left the room.`,
      description: "Please wait for another player to join...",
      data: waitingRoom
    } satisfies SocketResponse<WaitingRoom>)

    response({
      message: "You have left the room.",
      description: "This will not affect your ranking scores."
    })
  } catch (err) {
    response({
      message: "Failed to leave the room.",
      error: ServerError.parser(err)
    })
  }
}
