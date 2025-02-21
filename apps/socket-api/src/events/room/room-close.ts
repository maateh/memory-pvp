// types
import type { WaitingRoomVariants } from "@repo/schema/room"

// redis
import { redis } from "@repo/server/redis"
import { getRoom } from "@repo/server/redis-commands-throwable"
import { playerConnectionKey, roomKey, waitingRoomsKey } from "@repo/server/redis-keys"

// error
import { ServerError } from "@repo/server/error"

export const roomClose: SocketEventHandler = (socket) => async (_, response) => {
  console.log("DEBUG - room:close -> ", socket.id)

  const { playerId, playerTag, roomSlug } = socket.ctx.connection
  socket.ctx.connection = undefined!

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

    await Promise.all([
      redis.del(playerConnectionKey(playerId)),
      redis.json.del(roomKey(roomSlug)),
      room.status === "waiting"
        ? redis.lrem(waitingRoomsKey, 1, roomSlug)
        : redis.del(playerConnectionKey(room.guest.id))
    ])

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
