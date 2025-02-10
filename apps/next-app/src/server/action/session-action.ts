"use server"

import { redirect, RedirectType } from "next/navigation"

// types
import type { ClientGameSession } from "@repo/schema/session"

// server
import { redis } from "@/server/redis"
import { updateSessionStatus } from "@/server/db/mutation/session-mutation"

// actions
import { ApiError } from "@/server/_error"
import { playerActionClient, protectedActionClient, sessionActionClient } from "@/server/action"

// config
import { roomKey, sessionKey } from "@repo/config/redis-keys"
import { SESSION_STORE_TTL } from "@/config/redis-settings"
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
import { parseSchemaToClientSession } from "@/lib/util/parser/session-parser"

export const getActiveSession = sessionActionClient
  .action(async ({ ctx }) => {
    const clientSession = await ctx.redis.get<ClientGameSession>(
      sessionKey(ctx.activeSession.slug)
    )

    if (clientSession) return clientSession
    return parseSchemaToClientSession(ctx.activeSession, ctx.player.id)
  })

export const createSingleSession = playerActionClient
  .schema(createSingleSessionValidation)
  .action(async ({ ctx, parsedInput }) => {
    const { collectionId, forceStart, ...settings } = parsedInput

    /* Checks if there is any ongoing session */
    const activeSession = await ctx.db.gameSession.findFirst({
      where: {
        status: 'RUNNING',
        OR: [
          { ownerId: ctx.player.id },
          { guestId: ctx.player.id }
        ]
      }
    })

    /* Throws a custom 'ACTIVE_SESSION' action error if active session found */
    if (activeSession && !forceStart) {
      ApiError.throw({
        key: 'ACTIVE_SESSION',
        message: 'Active game session found.',
        description: 'Would you like to continue the ongoing session or start a new one?'
      })
    }

    /* Abandons session if 'forceStart' is applied and active session found */
    if (activeSession && forceStart) {
      await updateSessionStatus({
        session: activeSession,
        player: ctx.player,
        action: 'abandon'
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
      ApiError.throw({
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
        status: 'RUNNING',
        flipped: [],
        cards: generateSessionCards(collection),
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
    redirect('/game/single', forceStart ? RedirectType.replace : RedirectType.push)
  })

export const createMultiSession = playerActionClient
  .schema(createMultiSessionValidation)
  .action(async ({ ctx, parsedInput }) => {
    const { collectionId, guestId, ...settings } = parsedInput

    // FIXME: active session must be checked before the owner user creates and the guest user joins the room

    const collection = await ctx.db.cardCollection.findUnique({
      where: { id: collectionId },
      include: {
        user: true,
        cards: true
      }
    })

    if (!collection) {
      ApiError.throw({
        key: "COLLECTION_NOT_FOUND",
        message: "Sorry, but we can't find the card collection you selected.",
        description: "Please, select another card collection or try again later."
      })
    }

    const session = await ctx.db.gameSession.create({
      data: {
        ...settings,
        status: 'RUNNING',
        flipped: [],
        cards: generateSessionCards(collection),
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

    const response = await redis.json.set(
      roomKey(session.slug),
      "$.session",
      session
    )

    if (response !== "OK") {
      ApiError.throw({
        key: 'UNKNOWN',
        message: 'Failed to store game session.',
        description: 'Cache server probably not available.'
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

    if (response !== 'OK') {
      ApiError.throw({
        key: 'UNKNOWN',
        message: 'Failed to store game session.',
        description: 'Cache server probably not available.'
      })
    }

    return session
  })

export const saveSession = sessionActionClient
  .schema(saveSessionValidation)
  .action(async ({ ctx, parsedInput: clientSession }) => {
    await ctx.redis.del(sessionKey(ctx.activeSession.slug))

    const session = await ctx.db.gameSession.update({
      where: { id: ctx.activeSession.id },
      data: clientSession,
      include: sessionSchemaFields
    })

    return parseSchemaToClientSession(session, ctx.player.id)
  })

export const finishSession = sessionActionClient
  .schema(finishSessionSchema)
  .action(async ({ ctx, parsedInput: session }) => {
    await ctx.redis.del(sessionKey(ctx.activeSession.slug))

    const { slug } = await updateSessionStatus({
      session,
      player: ctx.player,
      action: 'finish'
    })

    /*
     * Note: Unfortunately, passing 'RedirectType.replace' as redirect type doesn't work in NextJS 14.
     * Looks like it has been fixed in NextJS 15 so this will be a bit buggy until then.
     * 
     * https://github.com/vercel/next.js/discussions/60864
     */
    redirect(`/game/summary/${slug}`, RedirectType.replace)
  })

export const abandonSession = sessionActionClient
  .schema(abandonSessionValidation)
  .action(async ({ ctx, parsedInput: session }) => {
    await ctx.redis.del(sessionKey(ctx.activeSession.slug))

    if (!session) {
      const validation = await abandonSessionValidation.safeParseAsync(ctx.activeSession)

      if (!validation.success) {
        ApiError.throw({
          key: 'UNKNOWN',
          message: 'Something went wrong.',
          description: 'Session data appears to be corrupted because it failed to be parsed.'
        })
      }

      session = validation.data!
    }

    const { slug } = await updateSessionStatus({
      session,
      player: ctx.player,
      action: 'abandon'
    })

    /**
     * Note: Unfortunately, passing 'RedirectType.replace' as the redirect type doesn't work in NextJS 14.
     * Looks like it has been fixed in NextJS 15 so this will be a bit buggy until then.
     * 
     * https://github.com/vercel/next.js/discussions/60864
     */
    redirect(`/game/summary/${slug}`, RedirectType.replace)
  })

export const saveOfflineSession = protectedActionClient
  .schema(saveOfflineGameValidation)
  .action(async ({ ctx, parsedInput }) => {
    const { playerId, collectionId, ...session } = parsedInput

    const playerAmount = await ctx.db.playerProfile.count({
      where: {
        userId: ctx.user.id,
        id: playerId
      }
    })

    if (playerAmount === 0) {
      ApiError.throw({
        key: 'PLAYER_PROFILE_NOT_FOUND',
        message: 'Player profile not found.',
        description: "Select or create a new player to save your offline session."
      })
    }

    /**
     * Replaces the default 'offlinePlayer.id' placeholder constant
     * which is used by default in offline session stats.
     */
    const stats: PrismaJson.SessionStats = {
      ...session.stats,
      flips: {
        [playerId]: session.stats.flips[offlinePlayerMetadata.id]
      },
      matches: {
        [playerId]: session.stats.matches[offlinePlayerMetadata.id]
      }
    }

    const { slug } = await ctx.db.gameSession.create({
      data: {
        ...session, stats,
        slug: generateSessionSlug({ type: 'CASUAL', mode: 'SINGLE' }, true),
        type: 'CASUAL',
        mode: 'SINGLE',
        status: 'OFFLINE',
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
