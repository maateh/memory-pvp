// types
import type { WaitingRoomVariants } from "@repo/schema/session-room"

// redis
import { redis } from "@/redis"
import { getSocketConnection } from "@/redis/connection-commands"
import { getSessionRoom } from "@/redis/room-commands"

// config
import { connectionKey, playerConnectionKey, roomKey } from "@repo/config/redis-keys"

// error
import { SocketError } from "@repo/types/socket-api-error"

export const roomClose: SocketEventHandler = (socket) => async (_, response) => {
  console.log("DEBUG - room:close -> ", socket.id)

  // FIXME: if the session is running -> room cannot be closed

  try {
    const { playerId, roomSlug } = await getSocketConnection(socket.id)
    const room = await getSessionRoom<WaitingRoomVariants>(roomSlug)

    const commands: Promise<unknown>[] = [
      redis.del(connectionKey(socket.id)),
      redis.del(playerConnectionKey(playerId)),
      redis.json.del(roomKey(roomSlug))
    ]

    if (room.status !== "waiting" && room.guest.socketId) {
      commands.push(redis.del(connectionKey(room.guest.socketId)))
      commands.push(redis.del(playerConnectionKey(room.guest.id)))
    }

    await Promise.all(commands)

    if (room.status !== "waiting") {
      socket.broadcast.to(roomSlug).emit("room:closed", {
        message: `${room.owner.tag} has closed the room.`,
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
      message: "Failed to close session room.",
      error: SocketError.parser(err)
    })
  }
}
