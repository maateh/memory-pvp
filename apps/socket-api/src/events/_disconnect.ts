// types
import type { JoinedRoom } from "@repo/schema/room"
import type { PlayerConnection } from "@repo/schema/player-connection"

// redis
import { redis } from "@repo/server/redis"
import { getRoom } from "@repo/server/redis-commands"
import { playerConnectionKey, roomKey } from "@repo/server/redis-keys"

export const disconnect: SocketEventHandler = (socket) => async () => {
  console.info("DEBUG - disconnect -> ", socket.id)

  /* Note: Player connection has already been closed in another event handler. */
  if (!socket.ctx.connection) return

  const { playerId, playerTag, roomSlug } = socket.ctx.connection
  const offlineConnection: PlayerConnection = {
    ...socket.ctx.connection,
    status: "offline",
    socketId: null,
    connectedAt: null
  }

  try {
    const room = await getRoom(roomSlug)

    if (room.status === "waiting") {
      room.owner.connection = offlineConnection
      room.owner.ready = false

      await Promise.all([
        redis.hset(playerConnectionKey(playerId), offlineConnection),
        redis.json.set(roomKey(room.slug), "$", room, { xx: true })
      ])
    }

    if (room.status === "joined" || room.status === "ready") {
      const currentPlayerKey: "owner" | "guest" = room.owner.id === playerId ? "owner" : "guest"
      room[currentPlayerKey].connection = offlineConnection

      const joinedRoom: JoinedRoom = {
        ...room,
        status: "joined",
        owner: { ...room.owner, ready: false },
        guest: { ...room.guest, ready: false }
      }

      await Promise.all([
        redis.hset(playerConnectionKey(playerId), offlineConnection),
        redis.json.set(roomKey(room.slug), "$", joinedRoom, { xx: true })
      ])

      socket.broadcast.to(room.slug).emit("room:disconnected", {
        message: `${playerTag} has disconnected.`,
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
