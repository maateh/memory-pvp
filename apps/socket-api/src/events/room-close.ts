// types
import type { JoinedRoom, WaitingRoom } from "@repo/schema/session-room"

// redis
import { redis } from "@/redis"
import { getPlayerConnectionByField } from "@/redis/connection-commands"
import { getSessionRoom } from "@/redis/room-commands"

// config
import { connectionKey, roomKey, waitingRoomKey, waitingRoomsKey } from "@repo/config/redis-keys"

// error
import { SocketError } from "@repo/types/socket-api-error"

export const roomClose: SocketEventHandler = (socket) => async (_, response) => {
  console.log("DEBUG - room:close -> ", socket.id)

  try {
    const roomSlug = await getPlayerConnectionByField<string>(socket.id, 'roomSlug')
    const room = await getSessionRoom<WaitingRoom | JoinedRoom>(roomSlug, true)
    
    await Promise.all([
      redis.del(connectionKey(room.owner.socketId)),
      redis.del(room.status === "waiting" ? waitingRoomKey(roomSlug) : roomKey(roomSlug)),
      room.status === "waiting" ? redis.lrem(waitingRoomsKey, 1, roomSlug) : null,
      room.status !== "waiting" ? redis.del(connectionKey(room.guest.socketId)) : null
    ])

    if (room.status !== "waiting") {
      socket.broadcast.to(roomSlug).emit("room:closed", {
        success: true,
        message: `${room.owner.tag} has closed the room.`,
        data: null
      } satisfies SocketResponse<null>)
    }

    socket.leave(roomSlug)
    response({
      success: true,
      message: "Session room has been successfully closed.",
      data: null
    })
  } catch (err) {
    response({
      success: false,
      message: "Failed to close session room.",
      error: SocketError.parser(err),
      data: null
    })
  }
}
