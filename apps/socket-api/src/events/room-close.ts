// types
import type { JoinedRoom, WaitingRoom } from "@repo/schema/session-room"

// redis
import { redis } from "@repo/redis"
import { connectionKey, roomKey } from "@repo/redis/keys"
import { getPlayerConnectionByField } from "@/commands/connection-commands"
import { getSessionRoom } from "@/commands/room-commands"

// error
import { SocketError } from "@repo/types/socket-api-error"

export const roomClose: SocketEventHandler = (socket) => async (_, response) => {
  console.log("DEBUG - room:close -> ", socket.id)

  try {
    const roomSlug = await getPlayerConnectionByField<string>(socket.id, 'roomSlug')
    const room = await getSessionRoom<WaitingRoom | JoinedRoom>(roomSlug)
    
    await Promise.all([
      redis.hdel(roomKey(roomSlug)),
      redis.hdel(connectionKey(room.owner.socketId)),
      room.status !== "waiting" ? redis.hdel(connectionKey(room.guest.socketId)) : null
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
