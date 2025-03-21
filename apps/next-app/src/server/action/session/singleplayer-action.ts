"use server"

import { redirect, RedirectType } from "next/navigation"

// redis
import { sessionKey } from "@repo/server/redis-keys"

// db
import { closeSession } from "@repo/server/db-session-mutation"
import { getActiveSession } from "@/server/db/query/session-query"

// actions
import {
  playerActionClient,
  protectedActionClient,
  soloSessionActionClient
} from "@/server/action"

// config
import { SESSION_STORE_TTL } from "@repo/server/redis-settings"
import { offlinePlayerMetadata } from "@/config/player-settings"

// validations
import {
  createSoloSessionValidation,
  finishSoloSessionValidation,
  forceCloseSoloSessionValidation,
  saveOfflineSessionValidation,
  storeSoloSessionValidation
} from "@repo/schema/session-validation"

// helpers
import {
  generateSessionCards,
  generateSessionSlug,
  verifyCollectionInAction
} from "@/lib/helper/session-helper"

// utils
import { ServerError } from "@repo/server/error"
import { parseSchemaToClientSession } from "@/lib/util/parser/session-parser"

export const createSoloSession = playerActionClient
  .schema(createSoloSessionValidation)
  .action(async ({ ctx, parsedInput }) => {
    const { forceStart, } = parsedInput
    const { collectionId, ...settings } = parsedInput.settings

    const activeSession = await getActiveSession("SOLO", ctx.player.id)

    /* Throws server error with `ACTIVE_SESSION` key if active session found. */
    if (activeSession && !forceStart) {
      ServerError.throwInAction({
        key: "ACTIVE_SESSION",
        data: {
          mode: activeSession.mode,
          format: activeSession.format
        },
        message: "Active solo session found.",
        description: "Would you like to continue that session or start a new one?"
      })
    }

    /* Force closes active session if `forceStart` is applied. */
    if (activeSession && forceStart) {
      await closeSession(
        parseSchemaToClientSession(activeSession),
        ctx.player.id,
        "FORCE_CLOSED"
      )
    }

    /**
     * Finding collection with the specified `collectionId`.
     * Throws custom server errors if collection is not found
     * or table size is incompatible with the settings.
     */
    const collection = await verifyCollectionInAction({ ...settings, collectionId })

    /* Creates the game session, then redirects the user to the game page */
    await ctx.db.gameSession.create({
      data: {
        ...settings,
        slug: generateSessionSlug(settings),
        status: "RUNNING",
        flipped: [],
        cards: generateSessionCards(collection, settings.tableSize),
        currentTurn: ctx.player.id,
        stats: {
          timer: 0,
          flips: { [ctx.player.id]: 0 },
          matches: { [ctx.player.id]: 0 }
        },
        collection: { connect: { id: collection.id } },
        owner: { connect: { id: ctx.player.id } }
      }
    })

    redirect("/game/single", forceStart ? RedirectType.replace : RedirectType.push)
  })

export const storeSoloSession = soloSessionActionClient
  .schema(storeSoloSessionValidation)
  .action(async ({ ctx, parsedInput }) => {
    const { clientSession } = parsedInput

    const response = await ctx.redis.set(
      // TODO: key will be replaced
      sessionKey(ctx.activeSession.slug),
      clientSession,
      { ex: SESSION_STORE_TTL }
    )

    if (response !== "OK") {
      ServerError.throwInAction({
        key: "UNKNOWN",
        message: "Failed to store game session.",
        description: "Cache server probably not available."
      })
    }

    return clientSession
  })

export const finishSoloSession = soloSessionActionClient
  .schema(finishSoloSessionValidation)
  .action(async ({ ctx, parsedInput }) => {
    const { clientSession } = parsedInput

    await Promise.all([
      ctx.redis.del(sessionKey(ctx.activeSession.slug)),
      closeSession(clientSession, ctx.player.id, "FINISHED")
    ])

    redirect(`/game/summary/${clientSession.slug}`, RedirectType.replace)
  })

export const forceCloseSoloSession = soloSessionActionClient
  .schema(forceCloseSoloSessionValidation)
  .action(async ({ ctx, parsedInput }) => {
    const { clientSession } = parsedInput

    await Promise.all([
      ctx.redis.del(sessionKey(ctx.activeSession.slug)),
      closeSession(clientSession, ctx.player.id, "FORCE_CLOSED")
    ])

    redirect(`/game/summary/${clientSession.slug}`, RedirectType.replace)
  })

export const saveOfflineSession = protectedActionClient
  .schema(saveOfflineSessionValidation)
  .action(async ({ ctx, parsedInput }) => {
    const { playerId } = parsedInput
    const { collectionId, ...clientSession } = parsedInput.clientSession

    const player = await ctx.db.playerProfile.findFirst({
      where: {
        userId: ctx.user.id,
        id: playerId
      }
    })

    if (!player) {
      ServerError.throwInAction({
        key: "PLAYER_PROFILE_NOT_FOUND",
        message: "Player profile not found.",
        description: "Select or create a new player to save your offline session."
      })
    }

    /**
     * Replaces the default 'offlinePlayer.id' placeholder constant
     * which is used by default in offline session stats.
     */
    const stats: PrismaJson.SessionStats = {
      ...clientSession.stats,
      flips: {
        [playerId]: clientSession.stats.flips[offlinePlayerMetadata.id]
      },
      matches: {
        [playerId]: clientSession.stats.matches[offlinePlayerMetadata.id]
      }
    }

    const { slug } = await ctx.db.gameSession.create({
      data: {
        ...clientSession,
        stats,
        slug: generateSessionSlug({ mode: "CASUAL", format: "OFFLINE" }, true),
        status: "FINISHED",
        mode: "CASUAL",
        format: "OFFLINE",
        currentTurn: player.id,
        closedAt: new Date(),
        collection: { connect: { id: collectionId } },
        owner: { connect: { id: player.id } }
      }
    })

    redirect(`/game/summary/${slug}`, RedirectType.replace)
  })
