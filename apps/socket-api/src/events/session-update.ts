// redis
import { redis } from "@/redis"

type SessionUpdateData = {
  roomId: string
  session: ClientGameSession
}

export const sessionUpdate: SocketEventHandler<
SessionUpdateData,
  SessionRoom
> = (socket) => async (data, _) => {
  const { roomId, session } = data

  console.info("session:update -> ")
  socket.broadcast.to(roomId).emit("session:updated", { session })
}
