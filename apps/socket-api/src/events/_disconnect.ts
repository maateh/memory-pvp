// types
import type { JoinedRoom, RunningRoom, WaitingRoom } from "@repo/schema/room"

// redis
import { redis } from "@repo/server/redis"
import { saveRedisJson } from "@repo/server/redis-json"
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
      await Promise.all([
        saveRedisJson<Partial<WaitingRoom>>(roomKey(room.slug), "$", {
          connectionStatus: "offline",
          owner: {
            ...room.owner,
            ready: false,
            connection: offlineConnection
          }
        }, { type: "update" }),
        redis.hset(playerConnectionKey(playerId), offlineConnection)
      ])
    }

    if (room.status === "joined" || room.status === "ready") {
      const ownerIsOnline = room.owner.connection.status === "online"
      const guestIsOnline = room.guest.connection.status === "online"

      const updater: Partial<JoinedRoom> = {
        status: "joined",
        connectionStatus: ownerIsOnline || guestIsOnline ? "half_online" : "offline",
        owner: { ...room.owner, ready: false },
        guest: { ...room.guest, ready: false }
      }
      room[playerKey].connection = offlineConnection

      await Promise.all([
        saveRedisJson(roomKey(room.slug), "$", updater, { type: "update" }),
        redis.hset(playerConnectionKey(playerId), offlineConnection)
      ])

      socket.broadcast.to(room.slug).emit("room:disconnected", {
        message: `${playerTag} has disconnected.`,
        description: playerKey === "owner"
          ? "You can leave the room without losing your Elo points."
          : "You can kick the player out of the room if you don't want to wait any longer.",
        data: updater
      } satisfies SocketResponse<Partial<JoinedRoom>>)
    }

    if (room.status === "running" || room.status === "cancelled") {
      const ownerIsOnline = room.owner.connection.status === "online"
      const guestIsOnline = room.guest.connection.status === "online"

      const updater: Partial<RunningRoom> = {
        status: "cancelled",
        connectionStatus: ownerIsOnline || guestIsOnline ? "half_online" : "offline",
        owner: { ...room.owner, ready: false },
        guest: { ...room.guest, ready: false }
      }
      room[playerKey].connection = offlineConnection

      await Promise.all([
        saveRedisJson(roomKey(room.slug), "$", updater, { type: "update" }),
        redis.hset(playerConnectionKey(playerId), offlineConnection)
      ])

      socket.broadcast.to(room.slug).emit("room:disconnected", {
        message: `${playerTag} has disconnected.`,
        description: room.session.mode === "CASUAL"
          ? "If you don't want to wait for the player to reconnect, close the session."
          : "Please wait at least 5 minutes for the other player to reconnect. After that, you can claim this session as a win.",
        data: updater
      } satisfies SocketResponse<Partial<RunningRoom>>)
    }
  } catch (err) {
    console.error(err)
  }
}
