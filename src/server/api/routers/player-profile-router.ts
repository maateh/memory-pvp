import { z } from "zod"

// trpc
import { TRPCError } from "@trpc/server"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"

// lib
import { playerProfileCreateSchema, playerProfileUpdateSchema } from "@/lib/validations"

export const playerProfileRouter = createTRPCRouter({
  create: protectedProcedure
    .input(playerProfileCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const { playerTag, color } = input

      const player = await ctx.db.playerProfile.findUnique({
        where: {
          tag: playerTag
        }
      })

      if (player) {
        throw new TRPCError({ code: 'CONFLICT' })
      }

      const isActive = await ctx.db.playerProfile.count({
        where: {
          userId: ctx.user.id,
          isActive: true
        }
      })

      return await ctx.db.playerProfile.create({
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

      const player = await ctx.db.playerProfile.findUnique({
        where: {
          tag: playerTag
        }
      })

      if (player) {
        throw new TRPCError({ code: 'CONFLICT' })
      }

      return await ctx.db.playerProfile.update({
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

      const isActive = await ctx.db.playerProfile.findUnique({
        where: {
          id: playerId,
          isActive: true
        }
      })

      if (isActive) {
        throw new TRPCError({ code: 'CONFLICT' })
      }

      return await ctx.db.playerProfile.delete({
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

      return await ctx.db.playerProfile.update({
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
