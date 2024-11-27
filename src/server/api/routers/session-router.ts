// trpc
import { TRPCError } from "@trpc/server"
import { TRPCApiError } from "@/trpc/error"
import {
  createTRPCRouter,
  playerProcedure,
  activeSessionProcedure,
  protectedProcedure
} from "@/server/api/trpc"

// server
import { getRandomCollection } from "@/server/db/collection"

// validations
import { createSessionSchema, sessionFilterSchema } from "@/lib/validations/session-schema"

// helpers
import {
  generateSessionCards,
  generateSlug,
  getSessionSchemaIncludeFields,
  parseSchemaToClientSession,
  parseSessionFilter
} from "@/lib/helpers/session"

export const sessionRouter = createTRPCRouter({
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
          ctx.player.id
        )
      }

      return clientSession
    }),

  // TODO: related query hook will be refactored
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
            data: clientSession || parseSchemaToClientSession(activeSession, ctx.player.id)
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

      let collection: ClientCardCollection | null = null
      if (input.collectionId) {
        collection = await ctx.db.cardCollection.findUnique({
          where: {
            id: input.collectionId
          },
          include: {
            user: true,
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
              [ctx.player.id]: 0
            },
            matches: {
              // TODO: add guest matches (update validation schema)
              [ctx.player.id]: 0
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

      return parseSchemaToClientSession(session, ctx.player.id)
    })
})
