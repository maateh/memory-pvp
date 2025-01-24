// redis
import { redis } from "@repo/redis"

// error
import { SocketError } from "@repo/types/socket-api-error"

// utils
import { socketPlayerConnection } from "@/utils/socket-player-connection"

export const roomLeave: SocketEventHandler = (socket) => async (_, response) => {
  console.log("DEBUG - room:leave -> ", socket.id)

  try {
    // TODO:
    // - remove session player connection from redis + update session room
    // - update session room (by removing the player from the session room)

    // socket.leave(roomSlug)
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
