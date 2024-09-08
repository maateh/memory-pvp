import { v4 as uuidv4 } from "uuid"

// trpc
import { TRPCError } from "@trpc/server"
import { createTRPCRouter, gameProcedure, protectedGameProcedure } from "@/server/api/trpc"

// validations
import { startGameSchema } from "@/lib/validations"

export const gameRouter = createTRPCRouter({
  getActive: protectedGameProcedure
    .query(({ ctx }) => ctx.activeSession),

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
          sessionOwner: {
            connect: {
              id: ctx.playerProfile.id
            }
          }
        }
      })
    })
})
