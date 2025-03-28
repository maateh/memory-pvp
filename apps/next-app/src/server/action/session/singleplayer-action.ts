"use server"

import { redirect, RedirectType } from "next/navigation"

// redis
import { saveRedisJson } from "@repo/server/redis-json"
import { soloSessionKey } from "@repo/server/redis-keys"

// db
import { closeSession } from "@repo/server/db-session-mutation"
import { getActiveSession } from "@/server/db/query/session-query"

// actions
import {
  playerActionClient,
  soloSessionActionClient
} from "@/server/action"

// config
import { offlinePlayerMetadata } from "@/config/player-settings"
import { sessionSchemaFields } from "@/config/session-settings"

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
      await closeSession(parseSchemaToClientSession(activeSession), "FORCE_CLOSED", {
        requesterPlayerId: ctx.player.id,
        applyPenalty: true
      })
    }

    /**
     * Finding collection with the specified `collectionId`.
     * Throws custom server errors if collection is not found
     * or table size is incompatible with the settings.
     */
    const collection = await verifyCollectionInAction({ ...settings, collectionId })

    /* Creates the game session, then redirects the user to the game page */
    const session = await ctx.db.gameSession.create({
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
      },
      include: sessionSchemaFields
    })

    await saveRedisJson(
      soloSessionKey(ctx.player.id),
      "$",
      parseSchemaToClientSession(session)
    )

    redirect("/game/single", forceStart ? RedirectType.replace : RedirectType.push)
  })

export const storeSoloSession = soloSessionActionClient
  .schema(storeSoloSessionValidation)
  .action(async ({ ctx, parsedInput: updater }) => {
    const key = soloSessionKey(ctx.player.id)
    const alreadyStored = await ctx.redis.json.get(key)

    if (!alreadyStored) {
      updater = { ...parseSchemaToClientSession(ctx.activeSession), ...updater }
    }

    const { error } = await saveRedisJson(key, "$", updater, {
      type: alreadyStored ? "update" : "create"
    })

    if (error) {
      ServerError.throwInAction({
        key: "UNKNOWN",
        message: "Failed to store solo game session.",
        description: "Cache server probably not available."
      })
    }
  })

export const finishSoloSession = soloSessionActionClient
  .schema(finishSoloSessionValidation)
  .action(async ({ ctx, parsedInput }) => {
    const { cards, stats } = parsedInput

    await Promise.all([
      ctx.redis.del(soloSessionKey(ctx.player.id)),
      closeSession({
        ...parseSchemaToClientSession(ctx.activeSession),
        cards,
        stats
      }, "FINISHED", { requesterPlayerId: ctx.player.id })
    ])

    redirect(`/game/summary/${ctx.activeSession.slug}`, RedirectType.replace)
  })

export const forceCloseSoloSession = soloSessionActionClient
  .schema(forceCloseSoloSessionValidation)
  .action(async ({ ctx, parsedInput }) => {
    const { cards, stats } = parsedInput

    await Promise.all([
      ctx.redis.del(soloSessionKey(ctx.player.id)),
      closeSession({
        ...parseSchemaToClientSession(ctx.activeSession),
        cards,
        stats
      }, "FORCE_CLOSED", { requesterPlayerId: ctx.player.id, applyPenalty: true })
    ])

    redirect(`/game/summary/${ctx.activeSession.slug}`, RedirectType.replace)
  })

export const saveOfflineSession = playerActionClient
  .schema(saveOfflineSessionValidation)
  .action(async ({ ctx, parsedInput }) => {
    const { collectionId, tableSize, cards, startedAt } = parsedInput
    let { stats } = parsedInput

    /**
     * Replaces the default 'offlinePlayer.id' placeholder constant
     * which is used by default in offline session stats.
     */
    stats = {
      ...stats,
      flips: {
        [ctx.player.id]: stats.flips[offlinePlayerMetadata.id]
      },
      matches: {
        [ctx.player.id]: stats.matches[offlinePlayerMetadata.id]
      }
    }

    const { slug } = await ctx.db.gameSession.create({
      data: {
        tableSize,
        cards,
        stats,
        startedAt,
        slug: generateSessionSlug({ mode: "CASUAL", format: "OFFLINE" }, true),
        status: "FINISHED",
        mode: "CASUAL",
        format: "OFFLINE",
        currentTurn: ctx.player.id,
        closedAt: new Date(),
        collection: { connect: { id: collectionId } },
        owner: { connect: { id: ctx.player.id } },
        results: {
          create: {
            playerId: ctx.player.id,
            gainedElo: 0,
            flips: stats.flips[ctx.player.id],
            matches: stats.matches[ctx.player.id],
            timer: stats.timer
          }
        }
      }
    })

    redirect(`/game/summary/${slug}`, RedirectType.replace)
  })
