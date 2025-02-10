// types
import type { JoinedRoom } from "@repo/schema/session-room"

// redis
import { redis } from "@repo/server/redis"
import { getRoom, getSocketConnection } from "@repo/server/redis-commands"
import { roomKey } from "@repo/server/redis-keys"

// server
import { io } from "@/server"

// error
import { ServerError } from "@repo/server/error"

export const roomReady: SocketEventHandler<
  unknown,
  JoinedRoom | boolean
> = (socket) => async (_, response) => {
  console.log("DEBUG - room:ready -> ", socket.id)

  try {
    const { roomSlug, playerId } = await getSocketConnection(socket.id)
    const room = await getRoom<JoinedRoom>(roomSlug)

    if (room.status === "ready" || room.status === "starting") {
      ServerError.throw({
        type: "SOCKET_API",
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
    await redis.json.set(roomKey(roomSlug), "$", room, { xx: true })

    response({
      message: `Your status has been set to ${room[roomPlayerKey].ready ? "ready" : "unready"}.`,
      description: room[roomPlayerKey].ready
        ? room.status === "ready"
          ? "Session will be starting soon..."
          : "Waiting for the other player..."
        : "Please don't keep the other player waiting too long. :)",
      data: room[roomPlayerKey].ready
    })

    const currentPlayer = room.owner.id === playerId ? room.owner : room.guest
    const unreadyPlayerTag = !room.owner.ready ? room.owner.tag : room.guest.tag

    const message = room.status === "ready"
      ? "Session room is ready." : !room.owner.ready && !room.guest.ready
      ? "Waiting for both players to be ready..." : currentPlayer.ready
      ? `${currentPlayer.tag} is ready to play.`
      : `${currentPlayer.tag} is not ready now.`

    const description = room.status === "ready"
      ? "Session will be starting soon..." : room.owner.ready || room.guest.ready
      ? `Waiting for ${unreadyPlayerTag} to be ready...`
      : undefined

    io.to(roomSlug).emit("room:readied", {
      message,
      description,
      data: room
    } satisfies SocketResponse<JoinedRoom>)
  } catch (err) {
    console.error(err)
    response({
      message: "Failed to update your status.",
      error: ServerError.parser(err)
    })
  }
}
