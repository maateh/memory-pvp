// types
import type {
  ClientSessionCard,
  MultiplayerClientSession,
  SessionStateUpdater
} from "@repo/schema/session"

// redis
import { saveRedisJson } from "@repo/server/redis-json"
import { roomKey } from "@repo/server/redis-keys"

// server
import { io } from "@/server"

// helpers
import { currentPlayerKey, otherPlayerKey } from "@repo/helper/player"

// utils
import { ServerError } from "@repo/server/error"
import { elapsedTime } from "@repo/util/timer"

type CardHelperOpts = {
  playerId: string
  session: MultiplayerClientSession
}

/**
 * TODO: write doc
 * 
 * @param opts
 * @returns 
 */
export async function handleCardFlip(clickedCard: ClientSessionCard, {
  playerId,
  session
}: CardHelperOpts): Promise<{ shouldPairing: boolean }> {
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

  const updater: Partial<SessionStateUpdater> = {
    currentTurn: session.currentTurn,
    flipped: session.flipped,
    stats: session.stats
  }

  const { error } = await saveRedisJson(roomKey(session.slug), "$.session", updater)
  if (error) {
    ServerError.throw({
      thrownBy: "SOCKET_API",
      key: "UNKNOWN",
      message: "Failed to store session data.",
      description: "Cache server probably not available."
    })
  }

  io.to(session.slug).emit("session:card:flipped", {
    message: "Card flipped",
    data: updater
  } satisfies SocketResponse<Partial<SessionStateUpdater>>)

  return { shouldPairing: session.flipped.length > 1 }
}

/**
 * TODO: write doc
 * 
 * @param opts
 * @returns 
 */
export async function handleCardPairing({
  playerId,
  session
}: CardHelperOpts): Promise<{ isOver: boolean }> {
  const { flipped } = session
  let eventKey: "matched" | "unmatched" = "unmatched"

  if (session.format === "PVP") {
    session.currentTurn = session.currentTurn === playerId
      ? session[otherPlayerKey(session.owner.id, playerId)].id
      : session[currentPlayerKey(session.owner.id, playerId)].id
  }
  
  session.flipped = []
  if (flipped[0].id === flipped[1].id) {
    eventKey = "matched"
    session.cards = session.cards.map(
      (card) => card.id === flipped[0].id
        ? { ...card, matchedBy: playerId }
        : card
    )
    ++session.stats.matches[playerId]
  }

  const updater: Partial<SessionStateUpdater> = Object.assign({
    currentTurn: session.currentTurn,
    flipped: [],
    stats: session.stats
  }, eventKey === "matched" ? { cards: session.cards } : {})

  const { error } = await saveRedisJson(roomKey(session.slug), "$.session", updater)
  if (error) {
    ServerError.throw({
      thrownBy: "SOCKET_API",
      key: "UNKNOWN",
      message: "Failed to store session data.",
      description: "Cache server probably not available."
    })
  }

  io.to(session.slug).emit(`session:card:${eventKey}`, {
    message: "Cards paired",
    data: updater
  } satisfies SocketResponse<Partial<SessionStateUpdater>>)

  return { isOver: session.cards.every((card) => !!card.matchedBy) }
}
