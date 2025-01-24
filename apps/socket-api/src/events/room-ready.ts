// types
import type { JoinedRoom } from "@repo/schema/session-room"

// redis
import { redis } from "@repo/redis"

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
    const connection = await redis.hgetall<SocketPlayerConnection>(`memory:connections:${socket.id}`)
    if (!connection) {
      // TODO: force close session

      SocketError.throw({
        key: "PLAYER_CONNECTION_NOT_FOUND",
        message: "Player connection data not found.",
        description: "Something went wrong because your connection data has been lost. The session will be closed without point losses."
      })
    }

    const room = await redis.hgetall<JoinedRoom>(`memory:session_rooms:${connection.roomSlug}`)
    if (!room) {
      // TODO: remove player(s) connection data

      SocketError.throw({
        key: "ROOM_NOT_FOUND",
        message: "Session room not found.",
        description: "Sorry, but the room you are trying to join has been closed."
      })
    }
    
    room.owner.ready = room.owner.id === connection.playerId
    room.guest.ready = room.guest.id === connection.playerId
    room.status = room.owner.ready && room.guest.ready ? "ready" : "joined"
    await redis.hset(`memory:session_rooms:${connection.roomSlug}`, room)

    const unreadyPlayer = room.owner.ready ? room.guest.tag : room.owner.tag
    io.to(connection.roomSlug).emit("room:readied", {
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
