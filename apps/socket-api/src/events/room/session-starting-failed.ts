// types
import type { JoinedRoom } from "@repo/schema/room"

// redis
import { redis } from "@repo/server/redis"
import { getRoom } from "@repo/server/redis-commands-throwable"
import { playerConnectionKey, roomKey } from "@repo/server/redis-keys"

// socket
import { io } from "@/server"

// error
import { ServerError } from "@repo/server/error"

export const sessionStartingFailed: SocketEventHandler = (socket) => async () => {
  const { playerId, roomSlug } = socket.ctx.connection

  try {
    const room = await getRoom<JoinedRoom>(roomSlug)

    if (room.owner.id !== playerId) {
      ServerError.throw({
        thrownBy: "SOCKET_API",
        key: "ROOM_ACCESS_DENIED",
        message: "Failed to force close the room.",
        description: "You have no access to force close this room."
      })
    }

    if (room.status !== "ready") {
      ServerError.throw({
        thrownBy: "SOCKET_API",
        key: "ROOM_STATUS_CONFLICT",
        message: "Failed to force close the room.",
        description: "Room can only be force closed if it fails at starting."
      })
    }

    await Promise.all([
      redis.del(playerConnectionKey(playerId)),
      redis.del(playerConnectionKey(room.guest.id)),
      redis.json.del(roomKey(roomSlug))
    ])

    io.to(roomSlug).emit("session:starting:failed", {
      message: "Failed to start session in this room.",
      description: "Multiplayer session cannot be started as long as one of the players in the room has another active session."
    } satisfies SocketResponse)
  } catch (err) {
    io.to(roomSlug).emit("session:starting:failed", {
      message: "Failed to force close the room.",
      error: ServerError.parser(err)
    })
  }
}
