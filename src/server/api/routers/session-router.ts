import { v4 as uuidv4 } from "uuid"

// trpc
import { TRPCError } from "@trpc/server"
import { TRPCApiError } from "@/trpc/error"
import {
  createTRPCRouter,
  gameProcedure,
  protectedGameProcedure,
  protectedProcedure
} from "@/server/api/trpc"

// validations
import {
  clientSessionSchema,
  saveOfflineGameSchema,
  setupGameSchema,
  updateGameStatusSchema
} from "@/lib/validations/game-schema"

// utils
import { getMockCards, parseSchemaToClientSession } from "@/lib/utils/game"

export const sessionRouter = createTRPCRouter({
  getActive: protectedGameProcedure
    .query(async ({ ctx }) => {
      let clientSession: ClientGameSession | null = await ctx.redis.get(
        `session:${ctx.activeSession.sessionId}`
      )

      if (!clientSession) {
        const session = await ctx.db.gameSession.findUnique({
          where: {
            id: ctx.activeSession.id
          },
          include: {
            result: true 
          }
        })

        clientSession = parseSchemaToClientSession(session!)
      }

      return clientSession
    }),
  
  getPlayers: protectedGameProcedure
    .query(async ({ ctx }) => {
      return await ctx.db.gameSession.findUnique({
        where: {
          id: ctx.activeSession.id
        },
        select: {
          owner: {
            include: {
              user: {
                select: { imageUrl: true }
              }
            }
          },
          guest: {
            include: {
              user: {
                select: { imageUrl: true }
              }
            }
          }
        }
      })
    }),

  create: gameProcedure
    .input(setupGameSchema)
    .mutation(async ({ ctx, input }) => {
      const { type, mode, tableSize } = input
      

      let activeSession = await ctx.db.gameSession.findFirst({
        where: {
          status: 'RUNNING',
          OR: [
            { ownerId: ctx.playerProfile.id },
            { guestId: ctx.playerProfile.id }
          ]
        },
        include: {
          result: true
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
            data: clientSession || parseSchemaToClientSession(activeSession)
          } as TRPCApiError
        })
      }

      // TODO: implement "Competitive" game
      // Socket.io is going to be required for this.
      if (type === 'COMPETITIVE') {
        throw new TRPCError({
          code: 'NOT_IMPLEMENTED',
          cause: new TRPCApiError({
            key: 'UNKNOWN',
            message: 'Sorry, but currently you can only play in Casual.',
            description: 'This feature is still work in progress. Please, try again later.'
          })
        })
      }

      // TODO: implement "PVP" & "COOP" game modes
      // ...but first be ready with the basics.
      if (mode !== 'SINGLE') {
        throw new TRPCError({
          code: 'NOT_IMPLEMENTED',
          cause: new TRPCApiError({
            key: 'UNKNOWN',
            message: 'Sorry, but currently you can only play in Single.',
            description: 'This feature is still work in progress. Please, try again later.'
          })
        })
      }

      // TODO: save guest -> in pvp & coop modes
      return await ctx.db.gameSession.create({
        data: {
          type, mode, tableSize,
          sessionId: uuidv4(),
          status: 'RUNNING',
          timer: 0,
          flippedCards: [],
          cards: getMockCards(tableSize), // TODO: generate cards
          owner: {
            connect: {
              id: ctx.playerProfile.id
            }
          },
          result: {
            create: {}
          }
        },
        include: {
          result: true
        }
      })
    }),

  store: protectedGameProcedure
    .input(clientSessionSchema)
    .mutation(async ({ ctx, input: session }) => {
      return await ctx.redis.set(
        `session:${ctx.activeSession.sessionId}`,
        session,
        { ex: 300 }
      )
    }),

  save: protectedGameProcedure
    .input(clientSessionSchema)
    .mutation(async ({ ctx, input: session }) => {
      await ctx.redis.del(`session:${session.sessionId}`)

      return await ctx.db.gameSession.update({
        where: {
          sessionId: session.sessionId
        },
        data: {
          ...session,
          closedAt: session.status === 'FINISHED' || session.status === 'ABANDONED'
            ? new Date()
            : null,
          result: {
            update: session.result
          },
          owner: {
            connect: { id: ctx.playerProfile.id }
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
          closedAt: new Date(),
          result: {
            create: session.result
          },
          owner: {
            connect: { id: playerProfile.id }
          }
        }
      })
    }),

  updateStatus: protectedGameProcedure
    .input(updateGameStatusSchema)
    .mutation(async ({ ctx, input: status }) => {
      return await ctx.db.gameSession.update({
        where: {
          id: ctx.activeSession.id,
          status: {
            equals: 'RUNNING'
          }
        },
        data: {
          status,
          closedAt: new Date()
        }
      })
    })
})
