// socket
import { io } from "@/server"

// redis
import { redis } from "@repo/redis"

export const disconnect: SocketEventHandler = (socket) => async () => {
  await redis.del(`waiting_room:${socket.id}`)

  // TODO: close game session properly

  io.to(socket.id).emit("room:left", {
    message: "USER has disconnected."
  })
}
