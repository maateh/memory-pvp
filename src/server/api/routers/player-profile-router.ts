import { z } from "zod"

// trpc
import { TRPCError } from "@trpc/server"
import { TRPCApiError } from "@/trpc/error"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"

// lib
import {
  playerProfileCreateSchema,
  playerProfileUpdateSchema,
  playerTagSchema
} from "@/lib/validations/player-profile-schema"

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
        throw new TRPCError({
          code: 'CONFLICT',
          cause: new TRPCApiError({
            key: 'ALREADY_TAKEN',
            message: 'Player tag is already in use.',
            description: 'Sorry, but this player tag is already taken. Please try another one.'
          })
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
      const { previousTag, tag, color } = input

      const player = await ctx.db.playerProfile.findUnique({
        where: {
          tag: tag,
          AND: {
            tag: {
              not: previousTag
            }
          }
        }
      })

      if (player) {
        throw new TRPCError({
          code: 'CONFLICT',
          cause: new TRPCApiError({
            key: 'ALREADY_TAKEN',
            message: 'Player tag is already in use.',
            description: 'Sorry, but this player tag is already taken. Please try another one.'
          })
        })
      }

      return await ctx.db.playerProfile.update({
        where: {
          userId: ctx.user.id,
          tag: previousTag
        },
        data: { tag, color }
      })
    }),

  delete: protectedProcedure
    .input(playerTagSchema)
    .mutation(async ({ ctx, input: tag }) => {
      const player = await ctx.db.playerProfile.findUnique({
        where: {
          tag,
          isActive: true
        }
      })

      if (player) {
        throw new TRPCError({
          code: 'CONFLICT',
          cause: new TRPCApiError({
            key: 'ACTIVE_PLAYER_PROFILE',
            message: 'Player profile cannot be deleted.',
            description: `${player.tag} is an active player profile. Please select a new active profile before dleting this one.`

          })
        })
      }

      return await ctx.db.playerProfile.delete({
        where: {
          userId: ctx.user.id,
          tag,
          isActive: {
            not: true
          }
        }
      })
    }),

  selectAsActive: protectedProcedure
    .input(playerTagSchema)
    .mutation(async ({ ctx, input: tag }) => {
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
          tag
        },
        data: {
          isActive: true
        }
      })
    })
})
