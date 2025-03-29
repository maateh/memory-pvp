// types
import type { JoinedRoom, RunningRoom } from "@repo/schema/room"

// redis
import { saveRedisJson } from "@repo/server/redis-json"
import { roomKey } from "@repo/server/redis-keys"
import { getRoom } from "@repo/server/redis-commands-throwable"

// server
import { io } from "@/server"

// error
import { ServerError } from "@repo/server/error"

// helpers
import { currentPlayerKey } from "@repo/helper/player"

export const roomReady: SocketEventHandler<
  unknown,
  boolean
> = (socket) => async (_, response) => {
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

    const playerKey = currentPlayerKey(room.owner.id, playerId)
    const currentPlayer = room[playerKey]
    const otherPlayer = playerKey === "owner" ? room.guest : room.owner

    room[playerKey].ready = !currentPlayer.ready
    if (room.owner.ready && room.guest.ready) {
      room.status = room.status === "joined" ? "ready" : "running"
    }

    await saveRedisJson<Partial<JoinedRoom | RunningRoom>>(roomKey(roomSlug), "$", {
      status: room.status,
      [playerKey]: room[playerKey]
    }, { type: "update" })

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
