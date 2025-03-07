// types
import type { JoinedRoom, RunningRoom } from "@repo/schema/room"

// redis
import { redis } from "@repo/server/redis"
import { getRoom } from "@repo/server/redis-commands-throwable"
import { playerConnectionKey, roomKey } from "@repo/server/redis-keys"

// helpers
import { offlinePlayerConnection } from "@repo/helper/connection"
import { currentPlayerKey } from "@repo/helper/player"

export const disconnect: SocketEventHandler = (socket) => async () => {
  console.info("DEBUG - disconnect -> ", socket.id)

  /* Note: Player connection has already been closed in another event handler. */
  if (!socket.ctx.connection) return

  const { playerId, playerTag, roomSlug } = socket.ctx.connection
  const offlineConnection = offlinePlayerConnection(socket.ctx.connection)

  try {
    const room = await getRoom(roomSlug)
    const playerKey = currentPlayerKey(room.owner.id, playerId)

    if (room.status === "waiting") {
      room.connectionStatus = "offline"
      room.owner.connection = offlineConnection
      room.owner.ready = false

      await Promise.all([
        redis.hset(playerConnectionKey(playerId), offlineConnection),
        redis.json.set(roomKey(room.slug), "$", room, { xx: true })
      ])
    }

    if (room.status === "joined" || room.status === "ready") {
      room[playerKey].connection = offlineConnection

      const ownerIsOnline = room.owner.connection.status === "online"
      const guestIsOnline = room.guest.connection.status === "online"

      const joinedRoom: JoinedRoom = {
        ...room,
        status: "joined",
        connectionStatus: ownerIsOnline || guestIsOnline ? "half_online" : "offline",
        owner: { ...room.owner, ready: false },
        guest: { ...room.guest, ready: false }
      }

      await Promise.all([
        redis.hset(playerConnectionKey(playerId), offlineConnection),
        redis.json.set(roomKey(room.slug), "$", joinedRoom, { xx: true })
      ])

      socket.broadcast.to(room.slug).emit("room:disconnected", {
        message: `${playerTag} has disconnected.`,
        description: playerKey === "owner"
          ? "You can leave the room without losing any ranking scores."
          : "You can kick the player out of the room if you don't want to wait any longer.",
        data: joinedRoom
      } satisfies SocketResponse<JoinedRoom>)
    }

    if (room.status === "running" || room.status === "cancelled") {
      room[playerKey].connection = offlineConnection

      const ownerIsOnline = room.owner.connection.status === "online"
      const guestIsOnline = room.guest.connection.status === "online"

      const cancelledRoom: RunningRoom = {
        ...room,
        status: "cancelled",
        connectionStatus: ownerIsOnline || guestIsOnline ? "half_online" : "offline",
        owner: { ...room.owner, ready: false },
        guest: { ...room.guest, ready: false }
      }

      await Promise.all([
        redis.hset(playerConnectionKey(playerId), offlineConnection),
        redis.json.set(roomKey(room.slug), "$", cancelledRoom, { xx: true })
      ])

      socket.broadcast.to(room.slug).emit("room:disconnected", {
        message: `${playerTag} has disconnected.`,
        description: room.session.type === "CASUAL"
          ? "If you don't want to wait for the player to reconnect, close the session."
          : "Please wait at least 5 minutes for the other player to reconnect. After that, you can claim this session as a win.",
        data: cancelledRoom
      } satisfies SocketResponse<RunningRoom>)
    }
  } catch (err) {
    console.error(err)
  }
}
