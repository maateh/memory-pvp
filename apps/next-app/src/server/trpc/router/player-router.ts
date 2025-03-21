// server
import { ServerError } from "@repo/server/error"

// trpc
import { TRPCError } from "@trpc/server"
import { createTRPCRouter, protectedProcedure } from "@/server/trpc"

// validations
import { playerGetStatsValidation } from "@repo/schema/player-validation"
import { parseSessionFilterToWhere } from "@/lib/util/parser/session-parser"

export const playerProfileRouter = createTRPCRouter({
  getStats: protectedProcedure
    .input(playerGetStatsValidation)
    .query(async ({ ctx, input }) => {
      const { filter } = input
      const { playerId } = filter

      if (!playerId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          cause: new ServerError({
            thrownBy: "TRPC",
            key: "PLAYER_PROFILE_NOT_FOUND",
            message: "Missing player ID.",
            description: "Player filter params must include the ID of the player."
          })
        })
      }

      const sessions = await ctx.db.gameSession.findMany({
        where: parseSessionFilterToWhere(filter, ctx.user.id),
        select: {
          stats: true,
          results: {
            where: {
              player: {
                id: playerId,
                userId: ctx.user.id
              }
            },
            include: { player: true }
          }
        }
      })
    
      const playerStats = sessions.reduce((sum, { stats, results }) => {
        const result = results.find((result) => result.player.id === playerId)
        const gainedElo = result?.gainedElo || 0

        return {
          ...sum,
          elo: sum.elo + gainedElo,
          timer: sum.timer + stats.timer,
          flips: sum.flips + stats.flips[playerId],
          matches: sum.matches + stats.matches[playerId]
        }
      }, {
        sessions: sessions.length,
        elo: 0,
        timer: 0,
        flips: 0,
        matches: 0
      } satisfies PrismaJson.PlayerStats)

      return playerStats
    })
})
