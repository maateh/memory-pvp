// types
import type { JoinedRoom, WaitingRoom } from "@repo/schema/room"

// redis
import { redis } from "@repo/server/redis"
import { getRoom } from "@repo/server/redis-commands-throwable"
import { playerConnectionKey, roomKey, waitingRoomsKey } from "@repo/server/redis-keys"

// error
import { ServerError } from "@repo/server/error"

export const roomKick: SocketEventHandler<
  unknown,
  WaitingRoom
> = (socket) => async (_, response) => {
  console.log("DEBUG - room:kick -> ", socket.id)

  const { playerId, playerTag, roomSlug } = socket.ctx.connection

  try {
    const { guest, ...room } = await getRoom<JoinedRoom>(roomSlug)

    if (room.owner.id !== playerId) {
      ServerError.throw({
        thrownBy: "SOCKET_API",
        key: "ROOM_ACCESS_DENIED",
        message: "Failed to kick player.",
        description: "You are not the owner of this room."
      })
    }

    if (room.status !== "joined") {
      ServerError.throw({
        thrownBy: "SOCKET_API",
        key: "ROOM_STATUS_CONFLICT",
        message: "Failed to kick player.",
        description: "You can only kick players if the room status is waiting."
      })
    }
    
    const waitingRoom: WaitingRoom = {
      ...room,
      status: "waiting",
      connectionStatus: "half_online",
      owner: { ...room.owner, ready: false }
    }

    await Promise.all([
      redis.del(playerConnectionKey(guest.id)),
      redis.json.set(roomKey(roomSlug), "$", waitingRoom, { xx: true }),
      redis.lpush(waitingRoomsKey, roomSlug)
    ])

    socket.broadcast.to(roomSlug).emit("room:kicked", {
      message: `${playerTag} has kicked you out of the room.`,
      description: "This will not affect your ranking scores."
    } satisfies SocketResponse)

    response({
      message: `You kicked ${guest.tag} out of the room.`,
      description: "This will not affect your ranking scores.",
      data: waitingRoom
    })
  } catch (err) {
    response({
      message: "Failed to kick player.",
      error: ServerError.parser(err)
    })
  }
}
