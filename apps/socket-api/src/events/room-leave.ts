// types
import type { JoinedRoom, WaitingRoom } from "@repo/schema/session-room"

// redis
import { redis } from "@/redis"
import { getSocketConnection } from "@/redis/connection-commands"
import { getSessionRoom } from "@/redis/room-commands"

// config
import { connectionKey, playerConnectionKey, roomKey, waitingRoomKey } from "@repo/config/redis-keys"

// error
import { SocketError } from "@repo/types/socket-api-error"

export const roomLeave: SocketEventHandler = (socket) => async (_, response) => {
  console.log("DEBUG - room:leave -> ", socket.id)

  try {
    const { playerId, roomSlug } = await getSocketConnection(socket.id)
    const { guest, ...room } = await getSessionRoom<JoinedRoom>(roomSlug)
    
    const waitingRoom: WaitingRoom = {
      ...room,
      status: "waiting"
    }

    await Promise.all([
      redis.del(connectionKey(socket.id)),
      redis.del(playerConnectionKey(playerId)),
      redis.del(roomKey(roomSlug)),
      redis.hset(waitingRoomKey(roomSlug), waitingRoom)
    ])

    socket.leave(roomSlug)
    socket.broadcast.to(roomSlug).emit("room:left", {
      message: `${guest.tag} has left the room.`,
      description: "Please wait for another player to join...",
      data: waitingRoom
    } satisfies SocketResponse<WaitingRoom>)

    response({
      message: "You have left the room.",
      description: "This will not affect your ranking scores."
    })
  } catch (err) {
    response({
      message: "Failed to leave the room.",
      error: SocketError.parser(err)
    })
  }
}
