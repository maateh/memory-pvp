// types
import type { JoinedRoom, WaitingRoom } from "@repo/schema/room"

// redis
import { leaveWaitingRoom } from "@repo/server/redis-commands"
import { getRoom } from "@repo/server/redis-commands-throwable"

// error
import { ServerError } from "@repo/server/error"

export const roomKick: SocketEventHandler<
  unknown,
  WaitingRoom
> = (socket) => async (_, response) => {
  const { playerId, playerTag, roomSlug } = socket.ctx.connection

  try {
    const { guest, ...room } = await getRoom<JoinedRoom>(roomSlug)

    if (room.owner.id !== playerId) {
      ServerError.throw({
        thrownBy: "SOCKET_API",
        key: "ROOM_ACCESS_DENIED",
        message: "Failed to kick player.",
        description: "You are not the owner of this room."
      })
    }

    if (room.status !== "joined") {
      ServerError.throw({
        thrownBy: "SOCKET_API",
        key: "ROOM_STATUS_CONFLICT",
        message: "Failed to kick player.",
        description: "You can only kick players if the room status is waiting."
      })
    }
    
    const waitingRoom = await leaveWaitingRoom({ ...room, guest }, guest.id)
    socket.broadcast.to(roomSlug).emit("room:kicked", {
      message: `${playerTag} has kicked you out of the room.`,
      description: "This will not affect your Elo points."
    } satisfies SocketResponse)

    response({
      message: `You kicked ${guest.tag} out of the room.`,
      description: "This will not affect your Elo points.",
      data: waitingRoom
    })
  } catch (err) {
    response({
      message: "Failed to kick player.",
      error: ServerError.parser(err)
    })
  }
}
