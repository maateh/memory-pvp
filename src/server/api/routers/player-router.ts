// trpc
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"

// lib
import { playerProfileFormSchema } from "@/lib/validations"

export const playerRouter = createTRPCRouter({
  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.db.player.findMany({
        where: {
          profileId: ctx.profile.id
        },
        include: {
          profile: true
        }
      })
    }),

  create: protectedProcedure
    .input(playerProfileFormSchema)
    .mutation(async ({ ctx, input }) => {
      const { playerTag, color } = input

      return ctx.db.player.create({
        data: {
          profileId: ctx.profile.id,
          tag: playerTag,
          color
        }
      })
    })
})
