import { v4 as uuidv4 } from "uuid"

// trpc
import { TRPCError } from "@trpc/server"
import { TRPCApiError } from "@/trpc/error"
import { createTRPCRouter, gameProcedure, protectedGameProcedure } from "@/server/api/trpc"

// validations
import { saveOfflineGameSchema, setupGameSchema, updateGameStatusSchema } from "@/lib/validations"
import { getMockCards } from "@/lib/utils/game"

export const gameRouter = createTRPCRouter({
  getActive: protectedGameProcedure
    .query(async ({ ctx }) => {
      return await ctx.db.gameSession.findUnique({
        where: {
          id: ctx.activeSession.id
        },
        include: {
          result: true 
        }
      })
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
          finishedAt: new Date()
        }
      })
    }),

  create: gameProcedure
    .input(setupGameSchema)
    .mutation(async ({ ctx, input }) => {
      const { type, mode, tableSize } = input

      const activeSession = await ctx.db.gameSession.findFirst({
        where: {
          status: 'RUNNING',
          OR: [
            { ownerId: ctx.playerProfile.id },
            { guestId: ctx.playerProfile.id }
          ]
        }
      })

      if (activeSession) {
        throw new TRPCError({
          code: 'CONFLICT',
          cause: {
            key: 'ACTIVE_SESSION',
            message: 'Failed to start a new game session.',
            description: 'You cannot participate in two game sessions at once with the same player.',
            data: activeSession
          } as TRPCApiError
        })
      }

      // TODO: implement "Competitive" game
      // Socket.io is going to be required for this.
      if (type === 'COMPETITIVE') {
        throw new TRPCError({
          code: 'NOT_IMPLEMENTED',
          cause: new TRPCApiError({
            key: 'ACTIVE_SESSION',
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
            key: 'ACTIVE_SESSION',
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
          cards: getMockCards(tableSize), // TODO: generate cards
          owner: {
            connect: {
              id: ctx.playerProfile.id
            }
          }
        }
      })
    }),
  
  saveOffline: gameProcedure
    .input(saveOfflineGameSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        playerTag,
        tableSize,
        startedAt,
        timer,
        flips,
        cards
      } = input

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
          tableSize, startedAt, timer, cards,
          sessionId: uuidv4(),
          status: 'OFFLINE',
          type: 'CASUAL',
          mode: 'SINGLE',
          result: {
            create: {
              flips,
              score: 0 // TODO: think it over -> make it optional or is it okay this way?
            }
          },
          owner: {
            connect: { id: playerProfile.id }
          }
        }
      })
    })
})
