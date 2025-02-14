// types
import type { JoinedRoom, WaitingRoom } from "@repo/schema/room"

// redis
import { redis } from "@repo/server/redis"
import { getRoom } from "@repo/server/redis-commands"
import { playerConnectionKey, roomKey, waitingRoomsKey } from "@repo/server/redis-keys"

// error
import { ServerError } from "@repo/server/error"

export const roomLeave: SocketEventHandler = (socket) => async (_, response) => {
  console.log("DEBUG - room:leave -> ", socket.id)

  const { playerId, playerTag, roomSlug } = socket.ctx.connection
  socket.ctx.connection = undefined!

  // FIXME: if the session is running -> room cannot be left

  try {
    const { guest: _, ...room } = await getRoom<JoinedRoom>(roomSlug)
    
    const waitingRoom: WaitingRoom = {
      ...room,
      status: "waiting",
      owner: { ...room.owner, ready: false }
    }

    await Promise.all([
      redis.del(playerConnectionKey(playerId)),
      redis.json.set(roomKey(roomSlug), "$", waitingRoom, { xx: true }),
      redis.lpush(waitingRoomsKey, roomSlug)
    ])

    socket.leave(roomSlug)
    socket.broadcast.to(roomSlug).emit("room:left", {
      message: `${playerTag} has left the room.`,
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
      error: ServerError.parser(err)
    })
  }
}
