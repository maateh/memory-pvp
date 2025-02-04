// types
import type { JoinedRoom } from "@repo/schema/session-room"

// redis
import { redis } from "@/redis"
import { getSocketConnectionByField } from "@/redis/connection-commands"

// config
import { roomKey } from "@repo/config/redis-keys"

// error
import { SocketError } from "@repo/types/socket-api-error"

export const sessionStarting: SocketEventHandler = (socket) => async (_, response) => {
  console.log("DEBUG - session:starting -> ", socket.id)

  try {
    const roomSlug = await getSocketConnectionByField<string>(socket.id, 'roomSlug')
    await redis.json.set(
      roomKey(roomSlug),
      "$.status",
      '"starting"' as JoinedRoom["status"], /* Note: DO NOT REMOVE the extra outer delimiter! */
      { xx: true }
    )

    const message = "Initializing game session..."
    socket.broadcast.to(roomSlug).emit("session:starting", { message } satisfies SocketResponse)
    response({ message })
  } catch (err) {
    response({
      message: "Failed to update room status.",
      error: SocketError.parser(err)
    })
  }
}
