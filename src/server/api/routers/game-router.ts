import { v4 as uuidv4 } from "uuid"

// trpc
import { TRPCApiError } from "@/trpc/error"
import { createTRPCRouter, gameProcedure, protectedGameProcedure } from "@/server/api/trpc"

// validations
import { saveOfflineGameSchema, startGameSchema, updateGameStatusSchema } from "@/lib/validations"

export const gameRouter = createTRPCRouter({
  getActive: protectedGameProcedure
    .query(({ ctx }) => ctx.activeSession),

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
    .input(startGameSchema)
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
        throw new TRPCApiError({
          key: 'ACTIVE_SESSION',
          code: 'CONFLICT',
          message: 'Failed to start a new game session.',
          description: 'You cannot participate in two game sessions at once with the same player.'
        })
      }

      // TODO: implement "Competitive" game
      // Socket.io is going to be required for this.
      if (type === 'COMPETITIVE') {
        throw new TRPCApiError({
          key: 'ACTIVE_SESSION',
          code: 'NOT_IMPLEMENTED',
          message: 'Sorry, but currently you can only play in Casual.',
          description: 'This feature is still work in progress. Please, try again later.'
        })
      }

      // TODO: implement "PVP" & "COOP" game modes
      // ...but first be ready with the basics.
      if (mode !== 'SINGLE') {
        throw new TRPCApiError({
          key: 'ACTIVE_SESSION',
          code: 'NOT_IMPLEMENTED',
          message: 'Sorry, but currently you can only play in Single.',
          description: 'This feature is still work in progress. Please, try again later.'
        })
      }

      // TODO: save guest -> in pvp & coop modes
      return await ctx.db.gameSession.create({
        data: {
          sessionId: uuidv4(),
          status: 'RUNNING',
          type,
          mode,
          tableSize,
          startedAt: new Date(),
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
      const { playerTag, tableSize, startedAt } = input

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
        throw new TRPCApiError({
          key: 'PLAYER_PROFILE_NOT_FOUND',
          code: 'NOT_FOUND',
          message: 'Player profile not found.',
          description: "Please, select or create a new player profile where you'd like to save your offline session data."
        })
      }

      return await ctx.db.gameSession.create({
        data: {
          sessionId: uuidv4(),
          status: 'OFFLINE',
          type: 'CASUAL',
          mode: 'SINGLE',
          tableSize,
          startedAt,
          owner: {
            connect: { id: playerProfile.id }
          }
        }
      })
    })
})
