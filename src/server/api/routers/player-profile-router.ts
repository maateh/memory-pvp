import { z } from "zod"

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
      const { playerId, playerTag, color } = input

      return ctx.db.playerProfile.update({
        where: {
          userId: ctx.user.id,
          id: playerId
        },
        data: {
          tag: playerTag,
          color
        }
      })
    }),

  delete: protectedProcedure
    .input(z.object({ playerId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { playerId } = input

      return ctx.db.playerProfile.delete({
        where: {
          userId: ctx.user.id,
          id: playerId,
          isActive: {
            not: true
          }
        }
      })
    }),

  selectAsActive: protectedProcedure
    .input(z.object({ playerId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { playerId } = input

      await ctx.db.playerProfile.updateMany({
        where: {
          userId: ctx.user.id,
          isActive: true
        },
        data: {
          isActive: false
        }
      })

      return ctx.db.playerProfile.update({
        where: {
          userId: ctx.user.id,
          id: playerId
        },
        data: {
          isActive: true
        }
      })
    })
})
