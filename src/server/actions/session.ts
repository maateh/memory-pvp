"use server"

import { redirect, RedirectType } from "next/navigation"

// actions
import { ActionError } from "@/server/actions/_error"
import { protectedActionClient, sessionActionClient } from "@/server/actions"

// validations
import {
  abandonSessionSchema,
  clientSessionSchema,
  finishSessionSchema,
  saveOfflineGameSchema,
  saveSessionSchema
} from "@/lib/validations/session-schema"

// helpers
import {
  calculateSessionScore,
  generateSlug,
  getSessionSchemaIncludeFields,
  parseSchemaToClientSession
} from "@/lib/helpers/session"
import { getBulkUpdatePlayerStatsOperations } from "@/lib/helpers/player"

// constants
import { offlinePlayerMetadata } from "@/constants/player"
import { SESSION_STORE_TTL } from "@/lib/redis"

export const storeSession = sessionActionClient
  .schema(clientSessionSchema)
  .action(async ({ ctx, parsedInput: session }) => {
    const response = await ctx.redis.set(
      `session:${ctx.activeSession.slug}`,
      session,
      { ex: SESSION_STORE_TTL }
    )

    if (response !== 'OK') {
      ActionError.throw({
        key: 'UNKNOWN',
        message: 'Failed to store game session.',
        description: 'Cache server probably not available.'
      })
    }

    return session
  })

export const saveSession = sessionActionClient
  .schema(saveSessionSchema)
  .action(async ({ ctx, parsedInput: clientSession }) => {
    await ctx.redis.del(`session:${ctx.activeSession.slug}`)

    const session = await ctx.db.gameSession.update({
      where: { id: ctx.activeSession.id },
      data: clientSession,
      include: getSessionSchemaIncludeFields()
    })

    return parseSchemaToClientSession(session, ctx.player.id)
  })

export const finishSession = sessionActionClient
  .schema(finishSessionSchema)
  .action(async ({ ctx, parsedInput: session }) => {
    await ctx.redis.del(`session:${ctx.activeSession.slug}`)

    /* Updates the statistics of session players */
    await ctx.db.$transaction(
      getBulkUpdatePlayerStatsOperations(
        ctx.activeSession.players,
        session
      )
    )

    const { slug } = await ctx.db.gameSession.update({
      where: { id: ctx.activeSession.id },
      data: {
        ...session,
        status: 'FINISHED',
        closedAt: new Date(),
        results: {
          createMany: {
            data: ctx.activeSession.players.map((player) => ({
              playerId: player.id,
              flips: session.stats.flips[player.id],
              matches: session.stats.matches[player.id],
              score: calculateSessionScore(session, ctx.player.id)
            }))
          }
        }
      }
    })

    redirect(`/game/summary/${slug}`, RedirectType.replace)
  })

export const abandonSession = sessionActionClient
  .schema(abandonSessionSchema)
  .action(async ({ ctx, parsedInput: session }) => {
    await ctx.redis.del(`session:${ctx.activeSession.slug}`)

    if (!session) {
      const validation = await abandonSessionSchema.safeParseAsync(ctx.activeSession)

      if (!validation.success) {
        ActionError.throw({
          key: 'UNKNOWN',
          message: 'Something went wrong.',
          description: 'Session data appears to be corrupted because it failed to be parsed.'
        })
      }

      session = validation.data!
    }

    /* Updates the statistics of session players */
    await ctx.db.$transaction(
      getBulkUpdatePlayerStatsOperations(
        ctx.activeSession.players,
        session,
        'abandon'
      )
    )

    const { slug } = await ctx.db.gameSession.update({
      where: { id: ctx.activeSession.id },
      data: {
        ...session,
        status: 'ABANDONED',
        closedAt: new Date(),
        results: {
          createMany: {
            data: ctx.activeSession.players.map((player) => ({
              playerId: player.id,
              flips: session.stats.flips[player.id],
              matches: session.stats.matches[player.id],

              // TODO: in 'PVP' mode, only deducts for the player who abandoned the session
              score: calculateSessionScore(session, ctx.player.id, 'abandon')
            }))
          }
        }
      }
    })

    redirect(`/game/summary/${slug}`, RedirectType.replace)
  })

export const saveOfflineSession = protectedActionClient
  .schema(saveOfflineGameSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { playerId, collectionId, ...session } = parsedInput

    const playerAmount = await ctx.db.playerProfile.count({
      where: {
        userId: ctx.user.id,
        id: playerId
      }
    })

    if (playerAmount === 0) {
      throw new ActionError({
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
        slug: generateSlug({ type: 'CASUAL', mode: 'SINGLE' }, true),
        type: 'CASUAL',
        mode: 'SINGLE',
        status: 'OFFLINE',
        closedAt: new Date(),
        collection: {
          connect: { id: collectionId }
        },
        owner: {
          connect: { id: playerId }
        },
        players: {
          connect: { id: playerId }
        }
      }
    })

    redirect(`/game/summary/${slug}`, RedirectType.replace)
  })
