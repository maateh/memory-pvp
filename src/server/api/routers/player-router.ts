// trpc
import { TRPCError } from "@trpc/server"
import { TRPCApiError } from "@/trpc/error"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"

// validations
import { z } from "zod"
import { playerFilterSchema } from "@/lib/schema/param/player-param"
import { sessionFilterSchema } from "@/lib/schema/param/session-param"

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
    })
})
