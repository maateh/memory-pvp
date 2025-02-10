// types
import type { JoinedRoom, WaitingRoom } from "@repo/schema/session-room"

// redis
import { redis } from "@repo/server/redis"
import { getRoom, getSocketConnection } from "@repo/server/redis-commands"
import { connectionKey, playerConnectionKey, roomKey, waitingRoomsKey } from "@repo/server/redis-keys"

// error
import { SocketError } from "@repo/types/socket-api-error"

export const roomLeave: SocketEventHandler = (socket) => async (_, response) => {
  console.log("DEBUG - room:leave -> ", socket.id)

  // FIXME: if the session is running -> room cannot be left

  try {
    const { playerId, roomSlug } = await getSocketConnection(socket.id)
    const { guest, ...room } = await getRoom<JoinedRoom>(roomSlug)
    
    const waitingRoom: WaitingRoom = {
      ...room,
      status: "waiting",
      owner: { ...room.owner, ready: false }
    }

    await Promise.all([
      redis.del(connectionKey(socket.id)),
      redis.del(playerConnectionKey(playerId)),
      redis.json.set(roomKey(roomSlug), "$", waitingRoom, { xx: true }),
      redis.lpush(waitingRoomsKey, roomSlug)
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
