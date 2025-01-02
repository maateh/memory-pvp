// socket
import { io } from "@/server"

// redis
import { redis } from "@repo/redis"

export const disconnect: SocketEventHandler = (socket) => async () => {
  console.info("DEBUG - disconnect -> ", socket.id)

  try {
    const sessionKey = await redis.hget(`memory:connections:${socket.id}`, "roomSlug")
    await redis.del(`memory:connections:${socket.id}`)
    await redis.del(`memory:session_rooms:${sessionKey}`)
  
    // TODO: close game session properly
    io.to(socket.id).emit("room:left", {
      message: "USER has disconnected."
    }) 
  } catch (err) {
    console.error(err)
  }
}
