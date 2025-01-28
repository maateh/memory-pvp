// socket
import { io } from "@/server"

// redis
import { redis } from "@/redis"

type SessionCreatedData = {
  session: ClientGameSession
  roomId: string
}

export const sessionCreated: SocketEventHandler<
  SessionCreatedData,
  SessionRoom
> = (socket) => async (data, _) => {
  const { roomId, session } = data

  console.info("session:created -> ")
  await redis.del(`waiting_room:${roomId}`)

  io.to(roomId).emit("session:start", {
    message: "Session has been created. Let's start the game...",
    session
  })
}
