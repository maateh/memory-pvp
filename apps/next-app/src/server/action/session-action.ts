"use server"

// types
import type { MultiplayerClientSession } from "@repo/schema/session"
import type { JoinedRoom, RunningRoom } from "@repo/schema/room"

// redis
import { redis } from "@repo/server/redis"
import { roomKey } from "@repo/server/redis-keys"
import { getActiveRoom } from "@repo/server/redis-commands"

// db
import { getActiveSession } from "@/server/db/query/session-query"

// actions
import { playerActionClient } from "@/server/action"

// config
import { sessionSchemaFields } from "@/config/session-settings"

// validations
import { createMultiplayerSessionValidation } from "@repo/schema/session-validation"

// helpers
import { generateSessionCards } from "@/lib/helper/session-helper"

// utils
import { ServerError } from "@repo/server/error"
import { parseSchemaToClientSession } from "@/lib/util/parser/session-parser"

export const createMultiplayerSession = playerActionClient
  .schema(createMultiplayerSessionValidation)
  .action(async ({ ctx, parsedInput }) => {
    const { slug, guestId } = parsedInput
    const { collectionId, ...settings } = parsedInput.settings

    const activeSession = await getActiveSession(["COOP", "PVP"], ctx.player.id)
    const guestActiveSession = await getActiveSession(["COOP", "PVP"], guestId)

    if (activeSession || guestActiveSession) {
      ServerError.throwInAction({
        key: "ACTIVE_SESSION",
        message: "Active multiplayer session found.",
        description: "Session cannot be started as long as one of the players is in another multiplayer session."
      })
    }

    /* Finding collection with the specified `collectionId` */
    const collection = await ctx.db.cardCollection.findUnique({
      where: { id: collectionId },
      include: { user: true, cards: true }
    })
  
    /**
     * Throws server error with `COLLECTION_NOT_FOUND` key if
     * collection not found with the specified `collectionId`.
     */
    if (!collection) {
      ServerError.throwInAction({
        key: "COLLECTION_NOT_FOUND",
        message: "Sorry, but we can't find the card collection you selected.",
        description: "Please, select another card collection or try again later."
      })
    }

    /* Create the multiplayer game session */
    const session = await ctx.db.gameSession.create({
      data: {
        ...settings,
        slug,
        status: "RUNNING",
        flipped: [],
        cards: generateSessionCards(collection),
        currentTurn: Math.random() < 0.5 ? ctx.player.id : guestId,
        stats: {
          timer: 0,
          flips: {
            [ctx.player.id]: 0,
            [guestId]: 0
          },
          matches: {
            [ctx.player.id]: 0,
            [guestId]: 0
          }
        },
        collection: { connect: { id: collection.id } },
        owner: { connect: { id: ctx.player.id } },
        guest: { connect: { id: guestId } }
      },
      include: sessionSchemaFields
    })

    /* Gets the player's active room. */
    const activeRoom = await getActiveRoom<JoinedRoom>(ctx.player.id)

    /* Throws server error with `ROOM_NOT_FOUND` key if active room not found. */
    if (!activeRoom) {
      ServerError.throwInAction({
        key: "ROOM_NOT_FOUND",
        message: "Active room not found.",
        description: "Something went wrong. Please create or join another room."
      })
    }

    /* Updates the `JoinedRoom` room variant to a `RunningRoom` variant. */
    const room: RunningRoom = {
      ...activeRoom,
      status: "running",
      session: parseSchemaToClientSession(session) as MultiplayerClientSession
    }

    /* Throws server error with `UNKNOWN` key if failed to store the updated room data. */
    const response = await redis.json.set(roomKey(room.slug), "$", room, { xx: true })
    if (response !== "OK") {
      ServerError.throwInAction({
        key: "UNKNOWN",
        message: "Failed to store game session.",
        description: "Cache server probably not available."
      })
    }
  })
