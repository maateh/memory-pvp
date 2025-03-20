// types
import type { MultiplayerClientSession, ClientSessionCard } from "@repo/schema/session"
import type { RunningRoom } from "@repo/schema/room"
import type { SessionCardFlipValidation } from "@repo/schema/room-validation"

// schemas
import { sessionCardFlipValidation } from "@repo/schema/room-validation"

// redis
import { redis } from "@repo/server/redis"
import { roomKey } from "@repo/server/redis-keys"
import { closeSession } from "@repo/server/redis-commands"
import { getRoom } from "@repo/server/redis-commands-throwable"

// error
import { ServerError } from "@repo/server/error"

// server
import { io } from "@/server"

// helpers
import { currentPlayerKey, otherPlayerKey } from "@repo/helper/player"

// utils
import { elapsedTime } from "@repo/util/timer"
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

    const actionKey = handleCardFlip(clickedCard, { playerId, session })
    if (actionKey !== "pairing") {
      await redis.json.set(roomKey(roomSlug), "$.session", session, { xx: true })
    }
    
    io.to(roomSlug).emit("session:card:flipped", {
      message: `Card flipped | ${clickedCard.id}/${clickedCard.key}`,
      data: session
    } satisfies SocketResponse<MultiplayerClientSession>)

    if (actionKey !== "pairing") {
      response({ message: "Card flipped" })
      return
    }

    const { flipped } = session
    const eventKey = handleCardPairing({ playerId, session })
    await redis.json.set(roomKey(roomSlug), "$.session", session, { xx: true })
    
    io.to(roomSlug).emit(`session:card:${eventKey}`, {
      message: `Cards paired | ${
        flipped[0].id}/${flipped[0].key
      } - ${
        flipped[1].id}/${flipped[1].key
      }`,
      data: session
    } satisfies SocketResponse<MultiplayerClientSession>)

    const isOver = session.cards.every((card) => card.matchedBy !== null)
    if (!isOver) {
      response({ message: "Cards paired" })
      return
    }

    await closeSession({ ...room, session }, playerId, "FINISHED")

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

type SessionHandlerOptions = {
  playerId: string
  session: MultiplayerClientSession
}

function handleCardFlip(clickedCard: ClientSessionCard, {
  playerId,
  session
}: SessionHandlerOptions): "flipped" | "pairing" {
  session.flipped = [...session.flipped, {
    id: clickedCard.id,
    key: clickedCard.key
  }]

  ++session.stats.flips[playerId]
  session.stats.timer = elapsedTime(session.startedAt).seconds

  if (session.format === "COOP" && session.flipped.length === 1) {
    session.currentTurn = session.currentTurn === playerId
      ? session[otherPlayerKey(session.owner.id, playerId)].id
      : session[currentPlayerKey(session.owner.id, playerId)].id
  }

  return session.flipped.length === 1 ? "flipped" : "pairing"
}

function handleCardPairing({
  playerId,
  session
}: SessionHandlerOptions): "matched" | "unmatched" {
  const { flipped } = session
  session.flipped = []

  if (session.format === "PVP") {
    session.currentTurn = session.currentTurn === playerId
      ? session[otherPlayerKey(session.owner.id, playerId)].id
      : session[currentPlayerKey(session.owner.id, playerId)].id
  }
  
  if (flipped[0].id === flipped[1].id) {
    session.cards = session.cards.map(
      (card) => card.id === flipped[0].id
        ? { ...card, matchedBy: playerId }
        : card
    )
    ++session.stats.matches[playerId]
    return "matched"
  }
  return "unmatched"
}
