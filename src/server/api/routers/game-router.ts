import { v4 as uuidv4 } from "uuid"

// trpc
import { TRPCError } from "@trpc/server"
import { createTRPCRouter, gameProcedure, protectedGameProcedure } from "@/server/api/trpc"

// validations
import { startGameSchema, updateGameStatusSchema } from "@/lib/validations"

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

      if (ctx.activeSession) {
        throw new TRPCError({
          message: 'You cannot participate in two game sessions at once with the same player.',
          code: 'CONFLICT'
        })
      }

      // TODO: implement "Competitive" game
      // Socket.io is going to be required for this.
      if (type === 'COMPETITIVE') {
        throw new TRPCError({
          message: 'Sorry, but currently you can only play in Casual.',
          code: 'NOT_IMPLEMENTED'
        })
      }

      // TODO: implement "PVP" & "COOP" game modes
      // ...but first be ready with the basics.
      if (mode !== 'SINGLE') {
        throw new TRPCError({
          message: 'Sorry, but currently you can only play in Single.',
          code: 'NOT_IMPLEMENTED'
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
    })
})
