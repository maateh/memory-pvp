// trpc
import { TRPCError } from "@trpc/server"
import { TRPCApiError } from "@/trpc/error"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"

// validations
import { z } from "zod"
import {
  createPlayerSchema,
  updatePlayerSchema,
  playerTagSchema,
  playerFilterSchema
} from "@/lib/validations/player-schema"
import { sessionFilterSchema } from "@/lib/validations/session-schema"

export const playerProfileRouter = createTRPCRouter({
  getStats: protectedProcedure
    .input(z.object({
      playerFilter: playerFilterSchema,
      sessionFilter: sessionFilterSchema
    }))
    .query(async ({ ctx, input }): Promise<PrismaJson.PlayerStats> => {
      const { playerFilter, sessionFilter } = input

      const playerId = playerFilter.id
      if (!playerId) {
        throw new TRPCError({
          code: 'CONFLICT',
          cause: new TRPCApiError({
            key: 'PLAYER_PROFILE_NOT_FOUND',
            message: 'Missing player ID.',
            description: 'Player filter params must include the ID of the player.'
          })
        })
      }

      const sessions = await ctx.db.gameSession.findMany({
        where: {
          players: {
            some: {
              userId: ctx.user.id,
              ...playerFilter
            }
          },
          ...sessionFilter
        },
        select: {
          stats: true,
          results: {
            where: {
              player: {
                userId: ctx.user.id,
                ...playerFilter
              }
            },
            include: {
              player: true
            }
          }
        }
      })
    
      const stats = sessions.reduce((sum, { stats, results }) => {
        const result = results.find((result) => result.player.id === playerId)
        const score = result?.score || 0

        return {
          ...sum,
          score: sum.score + score,
          timer: sum.timer + stats.timer,
          flips: sum.flips + stats.flips[playerId],
          matches: sum.matches + stats.matches[playerId]
        }
      }, {
        sessions: sessions.length,
        score: 0,
        timer: 0,
        flips: 0,
        matches: 0
      } as PrismaJson.PlayerStats)

      return stats
    }),

  create: protectedProcedure
    .input(createPlayerSchema)
    .mutation(async ({ ctx, input }) => {
      const { tag, color } = input

      const playersAmount = await ctx.db.playerProfile.count({
        where: {
          userId: ctx.user.id
        }
      })

      if (playersAmount > 5) {
        throw new TRPCError({
          code: 'CONFLICT',
          cause: new TRPCApiError({
            key: 'PLAYER_PROFILE_LIMIT',
            message: "Player profile limitation.",
            description: 'Sorry, but you have reached the maximum number (5) of player profiles you can create.'
          })
        })
      }

      const player = await ctx.db.playerProfile.findUnique({
        where: { tag }
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
          isActive: !isActive,
          tag, color
        }
      })
    }),

  update: protectedProcedure
    .input(updatePlayerSchema)
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
            description: `${player.tag} is an active player profile. Please select another player profile before deleting this one.`

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
