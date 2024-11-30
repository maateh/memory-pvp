"use server"

import { redirect, RedirectType } from "next/navigation"

// server
import { getRandomCollection } from "@/server/db/collection"
import { updateSessionStatus } from "@/server/db/mutations/session-mutation"

// actions
import { ActionError } from "@/server/actions/_error"
import { playerActionClient, protectedActionClient, sessionActionClient } from "@/server/actions"

// validations
import {
  abandonSessionSchema,
  clientSessionSchema,
  createSessionSchema,
  finishSessionSchema,
  saveOfflineGameSchema,
  saveSessionSchema
} from "@/lib/validations/session-schema"

// helpers
import {
  generateSessionCards,
  generateSlug,
  getSessionSchemaIncludeFields,
  parseSchemaToClientSession
} from "@/lib/helpers/session"

// constants
import { offlinePlayerMetadata } from "@/constants/player"
import { SESSION_STORE_TTL } from "@/lib/redis"

export const getActiveSession = sessionActionClient
  .action(async ({ ctx }) => {
    const storeKey = `session:${ctx.activeSession.slug}`
    const clientSession = await ctx.redis.get<ClientGameSession>(storeKey)

    if (clientSession) return clientSession
    return parseSchemaToClientSession(ctx.activeSession, ctx.player.id)
  })

export const createSession = playerActionClient
  .schema(createSessionSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { collectionId, forceStart, ...sessionValues } = parsedInput

    // TODO: implement "PVP" & "COOP" game modes
    // Note: Socket.io implementation required
    if (sessionValues.mode !== 'SINGLE') {
      ActionError.throw({
        key: 'UNKNOWN',
        message: 'Sorry, but currently you can only play in Single.',
        description: 'This feature is still work in progress. Please, try again later.'
      })
    }

    /* Checks if there is any ongoing session */
    const activeSession = await ctx.db.gameSession.findFirst({
      where: {
        status: 'RUNNING',
        players: {
          some: { id: ctx.player.id }
        }
      }
    })

    /* Throws a custom 'ACTIVE_SESSION' action error if active session found */
    if (activeSession && !forceStart) {
      ActionError.throw({
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

    /* Loads the given or a randomly generated collection for the session */
    let collection: ClientCardCollection | null = null
    if (collectionId) {
      collection = await ctx.db.cardCollection.findUnique({
        where: { id: collectionId },
        include: {
          user: true,
          cards: true
        },
      })
    } else {
      collection = await getRandomCollection(sessionValues.tableSize)
    }

    if (!collection) {
      ActionError.throw({
        key: 'COLLECTION_NOT_FOUND',
        message: 'Sorry, but we cannot find card collection for your session.',
        description: 'Please, try select another card collection or try again later.'
      })
    }

    /* Creates the game session then redirects the user to the game page */
    await ctx.db.gameSession.create({
      data: {
        ...sessionValues,
        slug: generateSlug({ type: sessionValues.type, mode: sessionValues.mode }),
        status: 'RUNNING',
        flipped: [],
        cards: generateSessionCards(collection),
        stats: {
          timer: 0,
          flips: { // TODO: add guest flips (update validation schema)
            [ctx.player.id]: 0
          },
          matches: { // TODO: add guest matches (update validation schema)
            [ctx.player.id]: 0
          }
        },
        collection: {
          connect: { id: collection.id }
        },
        owner: {
          connect: { id: ctx.player.id }
        },
        players: { // TODO: connect guest (update validation schema)
          connect: [{ id: ctx.player.id }]
        }
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

    const { slug } = await updateSessionStatus({
      session,
      player: ctx.player,
      action: 'finish'
    })

    /**
     * Note: Unfortunately, passing 'RedirectType.replace' as the redirect type doesn't work in NextJS 14.
     * Looks like it has been fixed in NextJS 15 so this will be a bit buggy until then.
     * 
     * https://github.com/vercel/next.js/discussions/60864
     */
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
      ActionError.throw({
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

    /**
     * Note: Unfortunately, passing 'RedirectType.replace' as the redirect type doesn't work in NextJS 14.
     * Looks like it has been fixed in NextJS 15 so this will be a bit buggy until then.
     * 
     * https://github.com/vercel/next.js/discussions/60864
     */
    redirect(`/game/summary/${slug}`, RedirectType.replace)
  })
