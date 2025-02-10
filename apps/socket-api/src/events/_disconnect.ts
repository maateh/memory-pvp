// types
import type { JoinedRoom } from "@repo/schema/session-room"

// socket
import { io } from "@/server"

// redis
import { redis } from "@/redis"
import { getSocketConnection } from "@/redis/connection-commands"
import { getSessionRoom } from "@/redis/room-commands"

// config
import { connectionKey, playerConnectionKey, roomKey, waitingRoomsKey } from "@repo/config/redis-keys"
import { playerConnection } from "@repo/server/redis-data-parser"

export const disconnect: SocketEventHandler = (socket) => async () => {
  console.info("DEBUG - disconnect -> ", socket.id)

  try {
    const { roomSlug, playerId } = await getSocketConnection(socket.id)
    const room = await getSessionRoom(roomSlug)

    if (room.status === "waiting") {
      room.owner.status = "offline"
      room.owner.ready = false
      room.owner.socketId = null

      await Promise.all([
        redis.del(connectionKey(socket.id)),
        redis.json.set(roomKey(roomSlug), "$", room, { xx: true }),
        redis.hset(playerConnectionKey(playerId), playerConnection({
          playerId,
          roomSlug,
          status: "offline"
        }))
      ])
    }

    if (room.status === "joined" || room.status === "ready") {
      const currentPlayerKey: "owner" | "guest" = room.owner.id === playerId ? "owner" : "guest"
      const joinedRoom: JoinedRoom = {
        ...room as JoinedRoom,
        status: "joined",
        owner: { ...room.owner, ready: false },
        guest: { ...room.guest, ready: false }
      }
      room[currentPlayerKey].status = "offline"
      room[currentPlayerKey].socketId = null
      await Promise.all([
        redis.del(connectionKey(socket.id)),
        redis.hset(playerConnectionKey(playerId), playerConnection({ playerId, roomSlug, status: "offline" })),
        redis.json.set(roomKey(roomSlug), "$", joinedRoom, { xx: true })
      ])

      socket.broadcast.to(roomSlug).emit("room:disconnected", {
        message: `${room[currentPlayerKey].tag} has disconnected.`,
        description: currentPlayerKey === "owner"
          ? "You can leave the room without losing any ranking scores."
          : "You can kick the player out of the room if you don't want to wait any longer.",
        data: joinedRoom
      } satisfies SocketResponse<JoinedRoom>)
    }

    if (room.status === "starting" || room.status === "running") {
      // TODO:
      // - remove both joined players socket connection
      // - emit `session:cancelled` event
      // 
      // IMPLEMENT:
      // From this point, the session status must be changed to "cancelled".
      // - if the `room status === "cancelled"`
      //  -> the player who stayed has the right to:
      //    - claim the win but only if the other player doesn't reconnect for at least a minute
      //    - completely cancel the session without waiting for the other user to rejoin, but this case it doesn't count as a win
      //  -> if the player reconnects the session will continue normally
    }

    if (room.status === "finished") {
      // Note: i guess nothing should be done here, so it's just a reminder to think about it later
    }
  } catch (err) {
    console.error(err)
  }
}
