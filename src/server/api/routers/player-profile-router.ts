import { z } from "zod"

// trpc
import { TRPCApiError } from "@/trpc/error"
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
        throw new TRPCApiError({
          key: 'ALREADY_TAKEN',
          code: 'CONFLICT',
          message: 'Player tag is already in use.',
          description: 'Sorry, but this player is already taken. Please try another one.'
        })
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
        throw new TRPCApiError({
          key: 'ALREADY_TAKEN',
          code: 'CONFLICT',
          message: 'Player tag is already in use.',
          description: 'Sorry, but this player is already taken. Please try another one.'
        })
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

      const player = await ctx.db.playerProfile.findUnique({
        where: {
          id: playerId,
          isActive: true
        }
      })

      if (player) {
        throw new TRPCApiError({
          key: 'ACTIVE_PLAYER_PROFILE',
          code: 'CONFLICT',
          message: 'Player profile cannot be deleted.',
          description: `${player.tag} is an active player profile. Please select a new active profile before deleting this one.`
        })
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
