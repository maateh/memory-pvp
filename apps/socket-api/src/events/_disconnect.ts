// types
import type { JoinedRoom, RunningRoom } from "@repo/schema/room"

// redis
import { redis } from "@repo/server/redis"
import { getRoom } from "@repo/server/redis-commands-throwable"
import { playerConnectionKey, roomKey } from "@repo/server/redis-keys"

// utils
import { offlinePlayer } from "@repo/server/util"

export const disconnect: SocketEventHandler = (socket) => async () => {
  console.info("DEBUG - disconnect -> ", socket.id)

  /* Note: Player connection has already been closed in another event handler. */
  if (!socket.ctx.connection) return

  const { playerId, playerTag, roomSlug } = socket.ctx.connection
  const offlineConnection = offlinePlayer(socket.ctx.connection)

  try {
    const room = await getRoom(roomSlug)

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
      const currentPlayerKey: "owner" | "guest" = room.owner.id === playerId ? "owner" : "guest"
      room[currentPlayerKey].connection = offlineConnection

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
        description: currentPlayerKey === "owner"
          ? "You can leave the room without losing any ranking scores."
          : "You can kick the player out of the room if you don't want to wait any longer.",
        data: joinedRoom
      } satisfies SocketResponse<JoinedRoom>)
    }

    if (room.status === "running" || room.status === "cancelled") {
      const currentPlayerKey: "owner" | "guest" = room.owner.id === playerId ? "owner" : "guest"
      room[currentPlayerKey].connection = offlineConnection

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
        description: currentPlayerKey === "owner"
          ? ""
          : "",
        data: cancelledRoom
      } satisfies SocketResponse<RunningRoom>)

      // TODO: From this point, the session is "cancelled".
      // - if `session.type === CASUAL`
      //   -> Session can be abandoned anytime by the player who still connected without point losses.
      // 
      // - if `session.type === COMPETITIVE`
      //   -> Session can be abandoned by the player who still connected but
      //      only if the other player will not reconnect under 5 minutes.
      //      This case, the connected player can claim the session as a win,
      //      and the other player will lose points.
      //   -> If the disconnected player reconnects the session will continue normally.
    }

    if (room.status === "finished") {
      // Note: i guess nothing should be done here, so it's just a reminder to think about it later
    }
  } catch (err) {
    console.error(err)
  }
}
