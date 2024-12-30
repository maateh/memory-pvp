// redis
import { redis } from "@repo/redis"

type RoomJoinData = {
  roomId: string
  guest: ClientPlayer
}

export const roomJoin: SocketEventHandler<
  RoomJoinData,
  SessionRoom
> = (socket) => async (data, _) => {
  const { roomId, guest } = data

  console.info("room:join -> ")
  socket.join(roomId)

  // TODO: create session by sending back the guest user to the owner client
  // TODO: needs to be checked that only the owner user was in the room so the session will be created once
  socket.broadcast.to(roomId).emit("room:joined", {
    message: `${guest.username} has connected to the room. Game will start soon...`,
    guest
  })
}
