import { z } from "zod"

// trpc
import { TRPCError } from "@trpc/server"
import { TRPCApiError } from "@/trpc/error"
import {
  createTRPCRouter,
  playerProcedure,
  activeSessionProcedure,
  protectedProcedure
} from "@/server/api/trpc"

// validations
import {
  abandonSessionSchema,
  clientSessionSchema,
  createSessionSchema,
  finishSessionSchema,
  saveOfflineGameSchema,
  saveSessionSchema,
  sessionFilterSchema,
  sessionSortSchema
} from "@/lib/validations/session-schema"

// helpers
import {
  calculateSessionScore,
  generateSessionCards,
  generateSlug,
  getSessionSchemaIncludeFields,
  parseSchemaToClientSession,
  parseSessionFilter
} from "@/lib/helpers/session"
import { getBulkUpdatePlayerStatsOperations } from "@/lib/helpers/player"
import { getRandomCollection } from "@/lib/helpers/collection"

// constants
import { SESSION_STORE_TTL } from "@/lib/redis"
import { offlinePlayerMetadata } from "@/constants/player"

export const sessionRouter = createTRPCRouter({
  get: protectedProcedure
    .input(
      z.object({
        filter: sessionFilterSchema,
        sort: sessionSortSchema
      }).optional().default({})
    )
    .query(async ({ ctx, input }): Promise<ClientGameSession[]> => {
      const filter = parseSessionFilter(ctx.user.id, input.filter)

      const sessions = await ctx.db.gameSession.findMany({
        where: filter,
        orderBy: input.sort,
        include: getSessionSchemaIncludeFields()
      })

      const clientSessions = sessions.map((session) => {
        const playerTag = session.owner.tag
        return parseSchemaToClientSession(session, playerTag)
      })

      return clientSessions
    }),

  count: protectedProcedure
    .input(sessionFilterSchema)
    .query(async ({ ctx, input }) => {
      const filter = parseSessionFilter(ctx.user.id, input)

      return await ctx.db.gameSession.count({ where: filter })
    }),

  getActive: activeSessionProcedure
    .query(async ({ ctx }): Promise<ClientGameSession> => {
      let clientSession: ClientGameSession | null = await ctx.redis.get(
        `session:${ctx.activeSession.slug}`
      )

      if (!clientSession) {
        clientSession = parseSchemaToClientSession(
          ctx.activeSession,
          ctx.player.tag
        )
      }

      return clientSession
    }),

  create: playerProcedure
    .input(createSessionSchema)
    .mutation(async ({ ctx, input }): Promise<ClientGameSession> => {
      const activeSession = await ctx.db.gameSession.findFirst({
        where: {
          status: 'RUNNING',
          players: {
            some: {
              id: ctx.player.id
            }
          }
        },
        include: getSessionSchemaIncludeFields()
      })

      
      if (activeSession) {
        const clientSession: ClientGameSession | null = await ctx.redis.get(
          `session:${activeSession.slug}`
        )

        throw new TRPCError({
          code: 'CONFLICT',
          cause: {
            key: 'ACTIVE_SESSION',
            message: 'Failed to start a new game session.',
            description: 'You cannot participate in two game sessions at once with the same player.',
            data: clientSession || parseSchemaToClientSession(activeSession, ctx.player.tag)
          } as TRPCApiError
        })
      }

      // TODO: implement "PVP" & "COOP" game modes
      // Note: Socket.io implementation required
      if (input.mode !== 'SINGLE') {
        throw new TRPCError({
          code: 'NOT_IMPLEMENTED',
          cause: new TRPCApiError({
            key: 'UNKNOWN',
            message: 'Sorry, but currently you can only play in Single.',
            description: 'This feature is still work in progress. Please, try again later.'
          })
        })
      }

      let collection: CardCollectionWithCards | null = null
      if (input.collectionId) {
        collection = await ctx.db.cardCollection.findUnique({
          where: {
            id: input.collectionId
          },
          include: {
            cards: true
          },
        })
      } else {
        collection = await getRandomCollection(input.tableSize)
      }

      if (!collection) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          cause: new TRPCApiError({
            key: 'COLLECTION_NOT_FOUND',
            message: 'Sorry, but we cannot find card collection for your session.',
            description: 'Please, try select another card collection or try again later.'
          })
        })
      }

      const session = await ctx.db.gameSession.create({
        data: {
          type: input.type,
          mode: input.mode,
          tableSize: input.tableSize,
          slug: generateSlug({ type: input.type, mode: input.mode }),
          status: 'RUNNING',
          flipped: [],
          cards: generateSessionCards(collection),
          stats: {
            timer: 0,
            flips: {
              // TODO: add guest flips (update validation schema)
              [ctx.player.tag]: 0
            },
            matches: {
              // TODO: add guest matches (update validation schema)
              [ctx.player.tag]: 0
            }
          },
          collection: {
            connect: {
              id: collection.id
            }
          },
          owner: {
            connect: {
              id: ctx.player.id
            }
          },
          players: {
            connect: [
              // TODO: connect guest (update validation schema)
              { id: ctx.player.id }
            ]
          }
        },
        include: getSessionSchemaIncludeFields()
      })

      return parseSchemaToClientSession(session, ctx.player.tag)
    }),

  store: activeSessionProcedure
    .input(clientSessionSchema)
    .mutation(async ({ ctx, input: session }) => {
      return await ctx.redis.set(
        `session:${ctx.activeSession.slug}`,
        session,
        { ex: SESSION_STORE_TTL }
      )
    }),

  save: activeSessionProcedure
    .input(saveSessionSchema)
    .mutation(async ({ ctx, input: session }) => {
      await ctx.redis.del(`session:${ctx.activeSession.slug}`)

      return await ctx.db.gameSession.update({
        where: {
          id: ctx.activeSession.id
        },
        data: session
      })
    }),

  finish: activeSessionProcedure
    .input(finishSessionSchema)
    .mutation(async ({ ctx, input: session }) => {
      await ctx.redis.del(`session:${ctx.activeSession.slug}`)

      /** Updates the statistics of session players */
      await ctx.db.$transaction(
        getBulkUpdatePlayerStatsOperations(
          ctx.activeSession.players,
          session
        )
      )

      return await ctx.db.gameSession.update({
        where: {
          id: ctx.activeSession.id
        },
        data: {
          ...session,
          status: 'FINISHED',
          closedAt: new Date(),
          results: {
            createMany: {
              data: ctx.activeSession.players.map((player) => ({
                playerId: player.id,
                flips: session.stats.flips[player.tag],
                matches: session.stats.matches[player.tag],
                score: calculateSessionScore(session, ctx.player.tag)
              }))
            }
          }
        }
      })
    }),

  abandon: activeSessionProcedure
    .input(abandonSessionSchema)
    .mutation(async ({ ctx, input: session }) => {
      await ctx.redis.del(`session:${ctx.activeSession.slug}`)

      if (!session) {
        const validation = await abandonSessionSchema.safeParseAsync(ctx.activeSession)

        if (!validation.success) {
          throw new TRPCError({
            code: 'PARSE_ERROR',
            cause: new TRPCApiError({
              key: 'UNKNOWN',
              message: 'Something went wrong.',
              description: 'Session data appears to be corrupted because it failed to be parsed.'
            })
          })
        }

        session = validation.data!
      }

      /** Updates the statistics of session players */
      await ctx.db.$transaction(
        getBulkUpdatePlayerStatsOperations(
          ctx.activeSession.players,
          session,
          'abandon'
        )
      )

      return await ctx.db.gameSession.update({
        where: {
          id: ctx.activeSession.id
        },
        data: {
          ...session,
          status: 'ABANDONED',
          closedAt: new Date(),
          results: {
            createMany: {
              data: ctx.activeSession.players.map((player) => ({
                playerId: player.id,
                flips: session.stats.flips[player.tag],
                matches: session.stats.matches[player.tag],

                // TODO: in 'PVP' mode, only deducts for the player who abandoned the session
                score: calculateSessionScore(session, ctx.player.tag, 'abandon')
              }))
            }
          }
        }
      })
    }),
  
  saveOffline: protectedProcedure
    .input(saveOfflineGameSchema)
    .mutation(async ({ ctx, input }) => {
      const { playerTag, collectionId, ...session } = input

      const playerProfile = await ctx.db.playerProfile.findFirst({
        where: {
          userId: ctx.user.id,
          tag: playerTag
        },
        select: {
          id: true
        }
      })

      if (!playerProfile) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          cause: new TRPCApiError({
            key: 'PLAYER_PROFILE_NOT_FOUND',
            message: 'Player profile not found.',
            description: "Please, select or create a new player profile where you'd like to save your offline session data."
          })
        })
      }

      /**
       * Replaces the default 'offlinePlayer.tag' placeholder constant
       * which is used by default in offline session stats.
       */
      const stats: PrismaJson.SessionStats = {
        ...session.stats,
        flips: {
          [playerTag]: session.stats.flips[offlinePlayerMetadata.tag]
        },
        matches: {
          [playerTag]: session.stats.matches[offlinePlayerMetadata.tag]
        }
      }

      return await ctx.db.gameSession.create({
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
            connect: { id: playerProfile.id }
          },
          players: {
            connect: { id: playerProfile.id }
          }
        }
      })
    })
})
