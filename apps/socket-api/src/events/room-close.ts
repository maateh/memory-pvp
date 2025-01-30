// types
import type { JoinedRoom, WaitingRoom } from "@repo/schema/session-room"

// redis
import { redis } from "@/redis"
import { getSocketConnectionByField } from "@/redis/connection-commands"
import { getSessionRoom } from "@/redis/room-commands"

// config
import { connectionKey, playerConnectionKey, roomKey, waitingRoomKey, waitingRoomsKey } from "@repo/config/redis-keys"

// error
import { SocketError } from "@repo/types/socket-api-error"

export const roomClose: SocketEventHandler = (socket) => async (_, response) => {
  console.log("DEBUG - room:close -> ", socket.id)

  try {
    const roomSlug = await getSocketConnectionByField<string>(socket.id, 'roomSlug')
    const room = await getSessionRoom<WaitingRoom | JoinedRoom>(roomSlug, true)
    
    const commands = [
      redis.del(connectionKey(room.owner.socketId)),
      redis.del(playerConnectionKey(room.owner.id)),
      redis.del(room.status === "waiting" ? waitingRoomKey(roomSlug) : roomKey(roomSlug))
    ]

    if (room.status === "waiting") {
      commands.push(redis.lrem(waitingRoomsKey, 1, roomSlug))
    } else {
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
