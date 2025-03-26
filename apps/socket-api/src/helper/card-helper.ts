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
 * Handles a player's card flip in a memory card game session.
 * 
 * This function updates the session state by adding the flipped card, increasing the player's 
 * flip count, and updating the session timer. In cooperative (COOP) mode, it also switches 
 * the turn if it's the first flipped card in the round.
 * 
 * The updated session state is stored in Redis, and an event (`session:card:flipped`) is emitted 
 * to notify other players about the change. If the Redis update fails, an error is thrown.
 * 
 * @param {ClientSessionCard} clickedCard The card that was flipped.
 * @param {CardHelperOpts} opts The options containing the player ID and session data.
 * @returns {Promise<{ shouldPairing: boolean }>} An object indicating whether the flipped cards should be checked for pairing.
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

  const { error } = await saveRedisJson(
    roomKey(session.slug),
    "$.session",
    updater,
    { type: "update", override: { xx: true } }
  )

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
 * Handles card pairing logic after two cards have been flipped.
 * 
 * This function determines whether the two flipped cards form a match. If they do, the cards 
 * are marked as matched by the player. In PVP mode, it also switches the turn to the next player.
 * 
 * The updated session state is stored in Redis, and an event (`session:card:matched` or 
 * `session:card:unmatched`) is emitted to notify other players about the result. If the Redis 
 * update fails, an error is thrown.
 * 
 * @param {CardHelperOpts} opts The options containing the player ID and session data.
 * @returns {Promise<{ isOver: boolean }>} An object indicating whether the game session is over (all cards are matched).
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

  const { error } = await saveRedisJson(
    roomKey(session.slug),
    "$.session",
    updater,
    { type: "update", override: { xx: true } }
  )

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
