// types
import type { JoinedRoom, RunningRoom } from "@repo/schema/room"

// redis
import { redis } from "@repo/server/redis"
import { roomKey } from "@repo/server/redis-keys"
import { getRoom } from "@repo/server/redis-commands-throwable"

// server
import { io } from "@/server"

// error
import { ServerError } from "@repo/server/error"

export const roomReady: SocketEventHandler<
  unknown,
  boolean
> = (socket) => async (_, response) => {
  console.log("DEBUG - room:ready -> ", socket.id)

  const { playerId, roomSlug } = socket.ctx.connection

  try {
    const room = await getRoom(roomSlug)

    if (room.status !== "joined" && room.status !== "cancelled") {
      ServerError.throw({
        thrownBy: "SOCKET_API",
        key: "ROOM_STATUS_CONFLICT",
        message: "Failed to update your status.",
        description: "You cannot change your status in the current state of the room."
      })
    }

    const currentPlayerKey: keyof Pick<
      JoinedRoom,
      "guest" | "owner"
    > = room.owner.id === playerId ? "owner" : "guest"
    const currentPlayer = room[currentPlayerKey]
    const otherPlayer = currentPlayerKey === "owner" ? room.guest : room.owner

    room[currentPlayerKey].ready = !currentPlayer.ready
    if (room.owner.ready && room.guest.ready) {
      room.status = room.status === "joined" ? "ready" : "running"
    }

    await redis.json.set(roomKey(roomSlug), "$", room, { xx: true })

    response({
      message: `Your status has been set to ${currentPlayer.ready ? "ready" : "unready"}.`,
      data: currentPlayer.ready
    })

    const message = room.status === "ready"
      ? "Let's start the game..." : room.status === "running"
      ? "Let's continue the game..." : currentPlayer.ready
        ? `${currentPlayer.tag} is ready to play.` : otherPlayer.ready
        ? `${otherPlayer.tag} is ready to play.`
        : "Players are not ready yet."

    const description = room.status === "ready"
      ? "Initializing game session..." : room.status === "running"
      ? "Session will continue from the last save." : undefined

    io.to(roomSlug).emit("room:readied", {
      message,
      description,
      data: room
    } satisfies SocketResponse<JoinedRoom | RunningRoom>)
  } catch (err) {
    response({
      message: "Failed to update your status.",
      error: ServerError.parser(err)
    })
  }
}
