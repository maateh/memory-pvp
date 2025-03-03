// types
import type { MultiClientSession, ClientSessionCard } from "@repo/schema/session"
import type { RunningRoom } from "@repo/schema/room"
import type { SessionCardFlipValidation } from "@repo/schema/room-validation"

// schemas
import { sessionCardFlipValidation } from "@repo/schema/room-validation"

// redis
import { redis } from "@repo/server/redis"
import { playerConnectionKey, roomKey } from "@repo/server/redis-keys"
import { getRoom } from "@repo/server/redis-commands-throwable"

// server
import { io } from "@/server"

// helpers
import { updateSessionStatus } from "@repo/server/db-session-mutation"

// utils
import { ServerError } from "@repo/server/error"
import { getCurrentPlayerKey, getOtherPlayerKey } from "@/utils/player"
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
    } satisfies SocketResponse<MultiClientSession>)

    if (actionKey !== "pairing") return

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
    } satisfies SocketResponse<MultiClientSession>)

    const isOver = session.cards.every((card) => card.matchedBy !== null)
    if (!isOver) return

    await Promise.all([
      updateSessionStatus(session, playerId, "finish"),
      redis.del(playerConnectionKey(room.owner.id)),
      redis.del(playerConnectionKey(room.guest.id)),
      redis.json.del(roomKey(roomSlug))
    ])

    io.to(roomSlug).emit("session:finished", {
      message: "Session finished!",
      description: "Let's see the results...",
      data: roomSlug
    } satisfies SocketResponse<string>)
  } catch (err) {
    console.log(err)
    response({
      message: "Failed to flip card.",
      error: ServerError.parser(err)
    })
  }
}

type SessionHandlerOptions = {
  playerId: string
  session: MultiClientSession
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

  if (session.mode === "COOP" && session.flipped.length === 1) {
    session.currentTurn = session.currentTurn === playerId
      ? session[getOtherPlayerKey(session.owner.id, playerId)].id
      : session[getCurrentPlayerKey(session.owner.id, playerId)].id
  }

  return session.flipped.length === 1 ? "flipped" : "pairing"
}

function handleCardPairing({
  playerId,
  session
}: SessionHandlerOptions): "matched" | "unmatched" {
  const { flipped } = session
  session.flipped = []

  if (session.mode === "PVP") {
    session.currentTurn = session.currentTurn === playerId
      ? session[getOtherPlayerKey(session.owner.id, playerId)].id
      : session[getCurrentPlayerKey(session.owner.id, playerId)].id
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
