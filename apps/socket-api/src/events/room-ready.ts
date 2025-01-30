// types
import type { JoinedRoom } from "@repo/schema/session-room"

// redis
import { redis } from "@/redis"
import { getSocketConnection } from "@/redis/connection-commands"
import { getSessionRoom } from "@/redis/room-commands"

// config
import { roomKey } from "@repo/config/redis-keys"

// server
import { io } from "@/server"

// error
import { SocketError } from "@repo/types/socket-api-error"

export const roomReady: SocketEventHandler<
  unknown,
  JoinedRoom | boolean
> = (socket) => async (_, response) => {
  console.log("DEBUG - room:ready -> ", socket.id)

  try {
    const { roomSlug, playerId } = await getSocketConnection(socket.id)
    const room = await getSessionRoom<JoinedRoom>(roomSlug)

    if (room.status === "ready" || room.status === "starting") {
      SocketError.throw({
        key: "SESSION_ALREADY_STARTED",
        message: "Session has already started.",
        description: "You cannot change your status after the session has already started."
      })
    }
    
    const roomPlayerKey: keyof Pick<
      JoinedRoom,
      'guest' | 'owner'
    > = room.owner.id === playerId ? "owner" : "guest"

    room[roomPlayerKey].ready = !room[roomPlayerKey].ready
    room.status = room.owner.ready && room.guest.ready ? "ready" : "joined"
    await redis.hset(roomKey(roomSlug), room)

    response({
      message: `Your status has been successfully set to ${room[roomPlayerKey].ready ? "ready" : "unready"}.`,
      data: room[roomPlayerKey].ready
    })

    const unreadyPlayerTag = !room.owner.ready ? room.owner.tag : room.guest.tag
    const message = room.status === "ready"
      ? "Session room is ready." : !room.owner.ready && !room.guest.ready
      ? "Waiting for both players to be ready..."
      : `Waiting for ${unreadyPlayerTag} to be ready...`

    io.to(roomSlug).emit("room:readied", {
      message,
      data: room
    } satisfies SocketResponse<JoinedRoom>)
  } catch (err) {
    console.error(err)
    response({
      message: "Failed to update your status.",
      error: SocketError.parser(err)
    })
  }
}
