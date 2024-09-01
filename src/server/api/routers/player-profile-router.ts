// trpc
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"

// lib
import { playerProfileCreateSchema, playerProfileUpdateSchema } from "@/lib/validations"

export const playerProfileRouter = createTRPCRouter({
  create: protectedProcedure
    .input(playerProfileCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const { playerTag, color } = input

      const isActive = await ctx.db.playerProfile.count({
        where: {
          userId: ctx.user.id,
          isActive: true
        }
      })

      return ctx.db.playerProfile.create({
        data: {
          userId: ctx.user.id,
          tag: playerTag,
          color,
          isActive: !isActive
        }
      })
    }),

  update: protectedProcedure
    .input(playerProfileUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, playerTag, color } = input

      return ctx.db.playerProfile.update({
        where: {
          userId: ctx.user.id,
          id
        },
        data: {
          tag: playerTag,
          color
        }
      })
    })
})
