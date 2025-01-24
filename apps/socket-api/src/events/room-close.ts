// redis
import { redis } from "@repo/redis"

// error
import { SocketError } from "@repo/types/socket-api-error"

// utils
import { socketPlayerConnection } from "@/utils/socket-player-connection"

export const roomClose: SocketEventHandler = (socket) => async (_, response) => {
  console.log("DEBUG - room:close -> ", socket.id)

  try {
    // TODO:
    // - get socket player connection from redis by socket id (to access `roomSlug`)
    // - get session room for the other player info -> FIXME: add `socketId` to `sessionRoomPlayer` schema
    // - remove player connections from redis
    // - remove session room from redis

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
