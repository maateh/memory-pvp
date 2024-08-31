// trpc
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"

// lib
import { playerProfileFormSchema } from "@/lib/validations"

export const playerProfileRouter = createTRPCRouter({
  create: protectedProcedure
    .input(playerProfileFormSchema)
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
    })
})
