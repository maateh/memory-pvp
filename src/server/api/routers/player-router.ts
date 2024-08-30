import { z } from "zod"

// trpc
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"

export const playerRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        playerTag: z.string(),
        color: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { playerTag, color } = input

      const profile = await ctx.db.profile.findUnique({
        where: {
          clerkId: ctx.user.id
        }
      })

      const players = await ctx.db.player.create({
        data: {
          profileId: profile?.id!,
          tag: playerTag,
          color
        }
      })

      return players
    })
})
