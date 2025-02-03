// types
import type { JoinedRoom, WaitingRoom, SessionRoom } from "@repo/schema/session-room"

// socket
import { io } from "@/server"

// redis
import { redis } from "@/redis"
import { getSocketConnection } from "@/redis/connection-commands"
import { getSessionRoom } from "@/redis/room-commands"

// config
import { connectionKey, playerConnectionKey, roomKey, waitingRoomsKey } from "@repo/config/redis-keys"

export const disconnect: SocketEventHandler = (socket) => async () => {
  console.info("DEBUG - disconnect -> ", socket.id)

  try {
    const { roomSlug, playerId } = await getSocketConnection(socket.id)
    const room = await getSessionRoom<WaitingRoom | JoinedRoom | SessionRoom>(roomSlug)

    if (room.status === "waiting") {
      await Promise.all([
        redis.del(connectionKey(socket.id)),
        redis.del(playerConnectionKey(playerId)),
        redis.json.del(roomKey(roomSlug)),
        redis.lrem(waitingRoomsKey, 1, roomSlug)
      ])
    }

    if (room.status === "joined" || room.status === "ready") {
      const ownerDisconnected = room.owner.id === playerId
      const { guest: _, ...joinedRoom } = room as JoinedRoom
      const waitingRoom: WaitingRoom = { ...joinedRoom, status: "waiting" }

      const commands: Promise<unknown>[] = [
        redis.del(connectionKey(room.guest.socketId)),
        redis.del(playerConnectionKey(room.guest.id))
      ]

      if (ownerDisconnected) {
        commands.push(redis.del(connectionKey(room.owner.socketId)))
        commands.push(redis.del(playerConnectionKey(room.owner.id)))
        commands.push(redis.json.del(roomKey(roomSlug)))
      } else {
        commands.push(redis.json.set(roomKey(roomSlug), "$", waitingRoom, { xx: true }))
        commands.push(redis.lpush(waitingRoomsKey, roomSlug))
      }

      await Promise.all(commands)

      const eventKey = `room:${ownerDisconnected ? "closed" : "left"}`
      socket.broadcast.to(roomSlug).emit(eventKey, {
        message: `${playerId} has disconnected.`,
        description: ownerDisconnected
          ? "This will not affect your ranking scores."
          : "Please wait for another player to join...",
        data: ownerDisconnected ? null : waitingRoom
      } satisfies SocketResponse<WaitingRoom | null>)
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
