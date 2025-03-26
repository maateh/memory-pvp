// types
import type { RunningRoom } from "@repo/schema/room"
import type { SessionCardFlipValidation } from "@repo/schema/room-validation"

// schemas
import { sessionCardFlipValidation } from "@repo/schema/room-validation"

// redis
import { closeRunningRoom } from "@repo/server/redis-commands"
import { getRoom } from "@repo/server/redis-commands-throwable"

// server
import { io } from "@/server"

// helpers
import { handleCardFlip, handleCardPairing } from "@/helper/card-helper"

// utils
import { ServerError } from "@repo/server/error"
import { validate } from "@/utils/validate"

export const sessionCardFlip: SocketEventHandler<
  SessionCardFlipValidation,
  unknown
> = (socket) => async (input, response) => {
  console.log("DEBUG - session:card:flip -> ", socket.id)

  const { playerId, roomSlug } = socket.ctx.connection

  try {
    const { clickedCard } = validate(sessionCardFlipValidation, input)
    const room = await getRoom<RunningRoom>(roomSlug)

    if (room.status !== "running") {
      ServerError.throw({
        thrownBy: "SOCKET_API",
        key: "ROOM_STATUS_CONFLICT",
        message: "Failed to flip card.",
        description: "You can only flip cards if session is running."
      })
    }

    const { session } = room
    const flippable = session.currentTurn === playerId
      && session.flipped.length < 2
      && session.flipped.every(({ key }) => clickedCard.key !== key)
      && clickedCard.matchedBy === null

    if (!flippable) {
      ServerError.throw({
        thrownBy: "SOCKET_API",
        key: "CARD_FLIP_CONFLICT",
        message: "Card cannot be flipped.",
        description: "It's not your turn or this card is already flipped."
      })
    }

    const { shouldPairing } = await handleCardFlip(clickedCard, { playerId, session })
    if (!shouldPairing) return response({ message: "Card flipped" })

    const { isOver } = await handleCardPairing({ playerId, session })    
    if (!isOver) return response({ message: "Cards paired" })

    await closeRunningRoom({ ...room, session }, "FINISHED", { requesterPlayerId: playerId })
    io.to(roomSlug).emit("session:finished", {
      message: "Session finished!",
      description: "Let's see the results...",
      data: roomSlug
    } satisfies SocketResponse<string>)

    response({ message: "Session finished" })
  } catch (err) {
    response({
      message: "Failed to flip card.",
      error: ServerError.parser(err)
    })
  }
}
