import { v4 as uuidv4 } from "uuid"

// trpc
import { TRPCError } from "@trpc/server"
import { TRPCApiError } from "@/trpc/error"
import {
  createTRPCRouter,
  playerProcedure,
  protectedSessionProcedure,
  protectedProcedure
} from "@/server/api/trpc"

// validations
import {
  abandonSessionSchema,
  clientSessionSchema,
  finishSessionSchema,
  saveOfflineGameSchema,
  saveSessionSchema,
  setupGameSchema
} from "@/lib/validations/session-schema"

// helpers
import { parseSchemaToClientSession } from "@/lib/helpers/session"

// utils
import { getMockCards } from "@/lib/utils/game"

// constants
import { SESSION_STORE_TTL } from "@/lib/redis"

export const sessionRouter = createTRPCRouter({
  getActive: protectedSessionProcedure
    .query(async ({ ctx }): Promise<ClientGameSession> => {
      let clientSession: ClientGameSession | null = await ctx.redis.get(
        `session:${ctx.activeSession.sessionId}`
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
    .input(setupGameSchema)
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
        include: {
          owner: true,
          players: {
            include: {
              user: {
                select: { imageUrl: true }
              }
            }
          }
        }
      })

      
      if (activeSession) {
        const clientSession: ClientGameSession | null = await ctx.redis.get(
          `session:${activeSession.sessionId}`
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

      const session = await ctx.db.gameSession.create({
        data: {
          ...input,
          sessionId: uuidv4(),
          status: 'RUNNING',
          flippedCards: [],
          cards: getMockCards(input.tableSize), // TODO: generate cards
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
        include: {
          owner: true,
          players: {
            include: {
              user: {
                select: { imageUrl: true }
              }
            }
          }
        }
      })

      return parseSchemaToClientSession(session, ctx.player.tag)
    }),

  store: protectedSessionProcedure
    .input(clientSessionSchema)
    .mutation(async ({ ctx, input: session }) => {
      return await ctx.redis.set(
        `session:${ctx.activeSession.sessionId}`,
        session,
        { ex: SESSION_STORE_TTL }
      )
    }),

  save: protectedSessionProcedure
    .input(saveSessionSchema)
    .mutation(async ({ ctx, input: session }) => {
      await ctx.redis.del(`session:${ctx.activeSession.sessionId}`)

      return await ctx.db.gameSession.update({
        where: {
          id: ctx.activeSession.id
        },
        data: session
      })
    }),

  finish: protectedSessionProcedure
    .input(finishSessionSchema)
    .mutation(async ({ ctx, input: session }) => {
      await ctx.redis.del(`session:${ctx.activeSession.sessionId}`)

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

                // TODO: calculate results
                score: 0
              }))
            }
          }
        }
      })
    }),

  abandon: protectedSessionProcedure
    .input(abandonSessionSchema)
    .mutation(async ({ ctx, input: session }) => {
      await ctx.redis.del(`session:${ctx.activeSession.sessionId}`)

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

                // TODO: calculate results with maximum score deduction
                // (in 'PVP' mode only for the player who abandoned the session)
                score: 0
              }))
            }
          }
        }
      })
    }),
  
  saveOffline: protectedProcedure
    .input(saveOfflineGameSchema)
    .mutation(async ({ ctx, input }) => {
      const { playerTag, ...session } = input

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

      return await ctx.db.gameSession.create({
        data: {
          ...session,
          type: 'CASUAL',
          mode: 'SINGLE',
          status: 'OFFLINE',
          closedAt: new Date(),
          owner: {
            connect: { id: playerProfile.id }
          }
        }
      })
    })
})
