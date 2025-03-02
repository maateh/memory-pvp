"use server"

import { redirect, RedirectType } from "next/navigation"

// types
import type { MultiClientSession } from "@repo/schema/session"
import type { JoinedRoom, RunningRoom } from "@repo/schema/room"

// redis
import { redis } from "@repo/server/redis"
import { roomKey, sessionKey } from "@repo/server/redis-keys"
import { getActiveRoom } from "@repo/server/redis-commands"

// db
import { updateSessionStatus } from "@repo/server/db-session-mutation"
import { getActiveSession } from "@/server/db/query/session-query"

// actions
import {
  playerActionClient,
  protectedActionClient,
  sessionActionClient
} from "@/server/action"

// config
import { SESSION_STORE_TTL } from "@repo/server/redis-settings"
import { offlinePlayerMetadata } from "@/config/player-settings"
import { sessionSchemaFields } from "@/config/session-settings"

// validations
import { clientSessionSchema } from "@repo/schema/session"
import {
  abandonSessionValidation,
  createMultiSessionValidation,
  createSingleSessionValidation,
  finishSessionSchema,
  saveOfflineGameValidation,
  saveSessionValidation
} from "@repo/schema/session-validation"

// helpers
import { generateSessionCards, generateSessionSlug } from "@/lib/helper/session-helper"

// utils
import { ServerError } from "@repo/server/error"
import { parseSchemaToClientSession } from "@/lib/util/parser/session-parser"

export const createSingleSession = playerActionClient
  .schema(createSingleSessionValidation)
  .action(async ({ ctx, parsedInput }) => {
    const { forceStart } = parsedInput
    const { collectionId, ...settings } = parsedInput.settings

    /* Checks if there is any ongoing session */
    const activeSession = await getActiveSession(ctx.player.id)

    /* Throws server error with 'ACTIVE_SESSION' key if active session found. */
    if (activeSession && !forceStart) {
      ServerError.throwInAction({
        key: "ACTIVE_SESSION",
        data: { activeSessionMode: activeSession.mode },
        message: "Active game session found.",
        description: activeSession.mode === "SINGLE"
          ? "Would you like to continue the ongoing session or start a new one?"
          : "Please finish your active multiplayer session, before you start a new one."
      })
    }

    /* Abandons active session if 'forceStart' is applied. */
    if (activeSession && forceStart) {
      /* Note: multiplayer sessions can only be closed manually by the player. */
      if (activeSession.mode !== "SINGLE") {
        ServerError.throwInAction({
          key: "FORCE_START_NOT_ALLOWED",
          message: "Force start not allowed.",
          description: "You are not allowed to force close multiplayer sessions. Please finish it first, before you start a new one."
        })
      }

      await updateSessionStatus(
        parseSchemaToClientSession(activeSession),
        ctx.player.id,
        "abandon"
      )
    }

    const collection = await ctx.db.cardCollection.findUnique({
      where: { id: collectionId },
      include: {
        user: true,
        cards: true
      }
    })

    if (!collection) {
      ServerError.throwInAction({
        key: "COLLECTION_NOT_FOUND",
        message: "Sorry, but we can't find the card collection you selected.",
        description: "Please, select another card collection or try again later."
      })
    }

    /* Creates the game session then redirects the user to the game page */
    await ctx.db.gameSession.create({
      data: {
        ...settings,
        slug: generateSessionSlug(settings),
        status: "RUNNING",
        flipped: [],
        cards: generateSessionCards(collection),
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

    /**
     * Note: Unfortunately, passing 'RedirectType.replace' as the redirect type doesn't work in NextJS 14.
     * Looks like it has been fixed in NextJS 15 so this will be a bit buggy until then.
     * 
     * https://github.com/vercel/next.js/discussions/60864
     */
    redirect("/game/single", forceStart ? RedirectType.replace : RedirectType.push)
  })

export const createMultiSession = playerActionClient
  .schema(createMultiSessionValidation)
  .action(async ({ ctx, parsedInput }) => {
    const { slug, guestId } = parsedInput
    const { collectionId, ...settings } = parsedInput.settings

    const activeSession = await getActiveSession(ctx.player.id)
    const guestActiveSession = await getActiveSession(guestId)

    if (activeSession || guestActiveSession) {
      ServerError.throwInAction({
        key: "ACTIVE_SESSION",
        message: "Active game session found.",
        description: "Multiplayer session cannot be started as long as one of the players in the room has another active session."
      })
    }

    const collection = await ctx.db.cardCollection.findUnique({
      where: { id: collectionId },
      include: {
        user: true,
        cards: true
      }
    })

    if (!collection) {
      ServerError.throwInAction({
        key: "COLLECTION_NOT_FOUND",
        message: "Sorry, but we can't find the card collection you selected.",
        description: "Please, select another card collection or try again later."
      })
    }

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

    const activeRoom = await getActiveRoom<JoinedRoom>(ctx.player.id)
    if (!activeRoom) {
      ServerError.throwInAction({
        key: "ROOM_NOT_FOUND",
        message: "Active room not found.",
        description: "Something went wrong. Please create or join another room."
      })
    }

    const room: RunningRoom = {
      ...activeRoom,
      status: "running",
      session: parseSchemaToClientSession(session) as MultiClientSession
    }

    const response = await redis.json.set(roomKey(room.slug), "$", room, { xx: true })

    if (response !== "OK") {
      ServerError.throwInAction({
        key: "UNKNOWN",
        message: "Failed to store game session.",
        description: "Cache server probably not available."
      })
    }
  })

export const storeSession = sessionActionClient
  .schema(clientSessionSchema)
  .action(async ({ ctx, parsedInput: session }) => {
    const response = await ctx.redis.set(
      sessionKey(ctx.activeSession.slug),
      session,
      { ex: SESSION_STORE_TTL }
    )

    if (response !== "OK") {
      ServerError.throwInAction({
        key: "UNKNOWN",
        message: "Failed to store game session.",
        description: "Cache server probably not available."
      })
    }

    return session
  })

export const saveSession = sessionActionClient
  .schema(saveSessionValidation)
  .action(async ({ ctx, parsedInput }) => {
    const { clientSession } = parsedInput

    await ctx.redis.del(sessionKey(ctx.activeSession.slug))
    const session = await ctx.db.gameSession.update({
      where: { id: ctx.activeSession.id },
      data: clientSession,
      include: sessionSchemaFields
    })

    return parseSchemaToClientSession(session)
  })

export const finishSession = sessionActionClient
  .schema(finishSessionSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { clientSession } = parsedInput

    await Promise.all([
      ctx.redis.del(sessionKey(clientSession.slug)),
      updateSessionStatus(clientSession, ctx.player.id, "finish")
    ])

    /*
     * Note: Unfortunately, passing 'RedirectType.replace' as redirect type doesn't work in NextJS 14.
     * Looks like it has been fixed in NextJS 15 so this will be a bit buggy until then.
     * 
     * https://github.com/vercel/next.js/discussions/60864
     */
    redirect(`/game/summary/${clientSession.slug}`, RedirectType.replace)
  })

export const abandonSession = sessionActionClient
  .schema(abandonSessionValidation)
  .action(async ({ ctx, parsedInput }) => {
    let { clientSession } = parsedInput

    if (!clientSession) {
      const validation = await abandonSessionValidation.safeParseAsync(ctx.activeSession)

      if (!validation.success) {
        ServerError.throwInAction({
          key: "UNKNOWN",
          message: "Something went wrong.",
          description: "Session data appears to be corrupted because it failed to be parsed."
        })
      }

      clientSession = validation.data!.clientSession!
    }

    await Promise.all([
      ctx.redis.del(sessionKey(clientSession.slug)),
      updateSessionStatus(clientSession, ctx.player.id, "abandon")
    ])

    /**
     * Note: Unfortunately, passing 'RedirectType.replace' as the redirect type doesn't work in NextJS 14.
     * Looks like it has been fixed in NextJS 15 so this will be a bit buggy until then.
     * 
     * https://github.com/vercel/next.js/discussions/60864
     */
    redirect(`/game/summary/${clientSession.slug}`, RedirectType.replace)
  })

export const saveOfflineSession = protectedActionClient
  .schema(saveOfflineGameValidation)
  .action(async ({ ctx, parsedInput }) => {
    const { playerId } = parsedInput
    const { collectionId, owner, currentTurn, ...clientSession } = parsedInput.clientSession

    const playerAmount = await ctx.db.playerProfile.count({
      where: {
        userId: ctx.user.id,
        id: playerId
      }
    })

    if (playerAmount === 0) {
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
        slug: generateSessionSlug({ type: "CASUAL", mode: "SINGLE" }, true),
        type: "CASUAL",
        mode: "SINGLE",
        status: "OFFLINE",
        currentTurn: playerId,
        stats,
        closedAt: new Date(),
        collection: {
          connect: { id: collectionId }
        },
        owner: {
          connect: { id: playerId }
        }
      }
    })

    /**
     * Note: Unfortunately, passing 'RedirectType.replace' as the redirect type doesn't work in NextJS 14.
     * Looks like it has been fixed in NextJS 15 so this will be a bit buggy until then.
     * 
     * https://github.com/vercel/next.js/discussions/60864
     */
    redirect(`/game/summary/${slug}`, RedirectType.replace)
  })
