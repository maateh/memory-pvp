// types
import type { JoinedRoom, WaitingRoom, SessionRoom } from "@repo/schema/session-room"

// socket
import { io } from "@/server"

// redis
import { redis } from "@/redis"
import { getSocketConnection } from "@/redis/connection-commands"
import { getSessionRoom } from "@/redis/room-commands"

// config
import { connectionKey, playerConnectionKey, roomKey, waitingRoomKey, waitingRoomsKey } from "@repo/config/redis-keys"

export const disconnect: SocketEventHandler = (socket) => async () => {
  console.info("DEBUG - disconnect -> ", socket.id)

  try {
    const { roomSlug, playerId } = await getSocketConnection(socket.id)
    const room = await getSessionRoom<WaitingRoom | JoinedRoom | SessionRoom>(roomSlug, true)

    if (room.status === "waiting") {
      await Promise.all([
        redis.del(connectionKey(socket.id)),
        redis.del(playerConnectionKey(playerId)),
        redis.del(waitingRoomKey(roomSlug)),
        redis.lrem(waitingRoomsKey, 1, roomSlug)
      ])
    }

    if (room.status === "joined") {
      const ownerDisconnected = room.owner.id === playerId
      const { guest: _, ...joinedRoom } = room as JoinedRoom
      const waitingRoom: WaitingRoom = { ...joinedRoom, status: "waiting" }

      if (ownerDisconnected) {
        await Promise.all([
          redis.del(connectionKey(room.owner.socketId)),
          redis.del(connectionKey(room.guest.socketId)),
          redis.del(playerConnectionKey(room.owner.id)),
          redis.del(playerConnectionKey(room.guest.id)),
          redis.del(roomKey(roomSlug))
        ])
      } else {
        await Promise.all([
          redis.del(connectionKey(socket.id)),
          redis.del(playerConnectionKey(playerId)),
          redis.del(roomKey(roomSlug)),
          redis.hset(waitingRoomKey(roomSlug), waitingRoom),
          redis.lpush(waitingRoomsKey, roomSlug)
        ])
      }

      const eventKey = `room:${ownerDisconnected ? "closed" : "left"}`
      socket.broadcast.to(roomSlug).emit(eventKey, {
        message: `${playerId} has disconnected.`,
        description: ownerDisconnected
          ? "This will not affect your ranking scores."
          : "Please wait for another player to join...",
        data: ownerDisconnected ? null : waitingRoom
      } satisfies SocketResponse<WaitingRoom | null>)
    }

    if (room.status === "ready" || room.status === "starting") {
      // TODO:
      // - remove both joined players connection
      // - remove session room
      // - need to handle deleting the session from the database that might have already been created
      // - Note: from this point deducting points is reasonable (if the game session was COMPETITIVE)
      // - Note: (first create and then) emit `session:cancelled` event
    }

    if (room.status === "running") {
      // TODO:
      // - remove both joined players connection
      // - remove session room
      // - need to handle deleting the session from the database
      // - deduct points from the player who has left (if the game session was COMPETITIVE)
      // - Note: (first create and then) emit `session:cancelled` event
    }

    if (room.status === "finished") {
      // Note: i guess nothing should be done here, so it's just a reminder to think about it later
    }
  } catch (err) {
    console.error(err)
  }
}
