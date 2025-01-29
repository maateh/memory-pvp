// types
import type { JoinedRoom } from "@repo/schema/session-room"

// redis
import { redis } from "@/redis"
import { getSocketConnection } from "@/redis/connection-commands"
import { getSessionRoom } from "@/redis/room-commands"

// config
import { roomKey } from "@repo/config/redis-keys"

// server
import { io } from "@/server"

// error
import { SocketError } from "@repo/types/socket-api-error"

export const roomReady: SocketEventHandler<
  any,
  JoinedRoom
> = (socket) => async (_, response) => {
  console.log("DEBUG - room:ready -> ", socket.id)

  try {
    const { roomSlug, playerId } = await getSocketConnection(socket.id)
    const room = await getSessionRoom<JoinedRoom>(roomSlug)
    
    room.owner.ready = room.owner.id === playerId
    room.guest.ready = room.guest.id === playerId
    room.status = room.owner.ready && room.guest.ready ? "ready" : "joined"
    await redis.hset(roomKey(roomSlug), room)

    const unreadyPlayer = room.owner.ready ? room.guest.tag : room.owner.tag
    io.to(roomSlug).emit("room:readied", {
      message: room.status === "ready"
        ? "Session room is ready. Game will start soon..."
        : `Waiting for ${unreadyPlayer} to be ready...`,
      data: room
    })

    response({
      success: true,
      message: "Your status has been successfully set to ready.",
      data: null
    })
  } catch (err) {
    console.error(err)
    response({
      success: false,
      message: "Failed to set your status as ready. Please try again.",
      error: SocketError.parser(err),
      data: null
    })
  }
}
