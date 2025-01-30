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

    await redis.hmset(roomKey(roomSlug), {
      status: "starting"
    } as Pick<JoinedRoom, 'status'>)

    socket.broadcast.to(roomSlug).emit("session:starting", {
      message: "Initializing game session..."
    } satisfies SocketResponse)

    response({ message: "Initializing game session..." })
  } catch (err) {
    response({
      message: "Failed to update room status.",
      error: SocketError.parser(err)
    })
  }
}
