// types
import type { JoinedRoom, WaitingRoomVariants } from "@repo/schema/session-room"
import type { RoomConnectValidation } from "@repo/schema/session-room-validation"

// redis
import { redis } from "@repo/server/redis"
import { getPlayerConnectionByField, getRoom } from "@repo/server/redis-commands"
import { connectionKey, playerConnectionKey, roomKey, waitingRoomsKey } from "@repo/server/redis-keys"
import { playerConnection, socketConnection } from "@repo/server/redis-data-parser"

// schema
import { roomConnectValidation } from "@repo/schema/session-room-validation"

// error
import { SocketError } from "@repo/types/socket-api-error"

// utils
import { validate } from "@/utils/validate"

export const roomConnect: SocketEventHandler<
  RoomConnectValidation,
  WaitingRoomVariants
> = (socket) => async (input, response) => {
  console.log("DEBUG - room:connect -> ", socket.id)

  try {
    const { playerId } = validate(roomConnectValidation, input)
    const roomSlug = await getPlayerConnectionByField(playerId, "roomSlug")
    const room = await getRoom(roomSlug)
    
    const connection = socketConnection(socket.id, playerId, roomSlug)
    
    if (room.status === "waiting") {
      room.owner.status = "online"
      room.owner.socketId = socket.id
      room.owner.ready = false
    } else {
      const currentPlayerKey: "owner" | "guest" = room.owner.id === playerId ? "owner" : "guest"
      room[currentPlayerKey].status = "online"
      room[currentPlayerKey].socketId = socket.id
      
      room.status = "joined"
      room.owner.ready = false
      room.guest.ready = false
    }

    await Promise.all([
      redis.hset(connectionKey(socket.id), connection),
      redis.hset(playerConnectionKey(playerId), playerConnection({ ...connection, status: "online" })),
      redis.json.set(roomKey(roomSlug), `$`, room, { xx: true }),
      room.status !== "waiting" ? redis.lrem(waitingRoomsKey, 1, roomSlug) : null
    ])
    
    if (room.status !== "waiting") {
      socket.broadcast.to(roomSlug).emit("room:connected", {
        message: `${room.owner.id === playerId ? room.owner.tag : room.guest.tag} has connected to the room.`,
        data: room as JoinedRoom
      } satisfies SocketResponse<JoinedRoom>)
    }

    socket.join(roomSlug)
    response({
      message: "Successfully connected to the room.",
      data: room as WaitingRoomVariants
    })
  } catch (err) {
    console.error(err)
    response({
      message: "Session room not found.",
      error: SocketError.parser(err)
    })
  }
}
