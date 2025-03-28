// server
import { ServerError } from "@repo/server/error"

// trpc
import { TRPCError } from "@trpc/server"
import { createTRPCRouter, protectedProcedure } from "@/server/trpc"

// validations
import { playerGetStatsValidation } from "@repo/schema/player-validation"
import { parseResultFilterToWhere } from "@/lib/util/parser/result-parser"

export const playerProfileRouter = createTRPCRouter({
  getStats: protectedProcedure
    .input(playerGetStatsValidation)
    .query(async ({ ctx, input }) => {
      const { playerId, filter } = input

      const player = await ctx.db.playerProfile.findUnique({
        where: { id: playerId, userId: ctx.user.id },
        select: { stats: true }
      })

      if (!player) {
        throw new TRPCError({
          code: "NOT_FOUND",
          cause: new ServerError({
            thrownBy: "TRPC",
            key: "PLAYER_PROFILE_NOT_FOUND",
            message: "Player not found with this ID.",
            description: "Cannot find player profile with the specified ID."
          })
        })
      }

      if (Object.keys(filter).length === 0) {
        return player.stats
      }

      const results = await ctx.db.result.findMany({
        where: parseResultFilterToWhere(filter, playerId, ctx.user.id)
      })

      const playerStats = results.reduce((sum, { gainedElo, flips, matches, timer }) => {
        return {
          ...sum,
          elo: sum.elo + gainedElo,
          timer: sum.timer + timer,
          flips: sum.flips + flips,
          matches: sum.matches + matches
        }
      }, {
        sessions: results.length,
        elo: 0,
        timer: 0,
        flips: 0,
        matches: 0
      } satisfies PrismaJson.PlayerStats)

      return playerStats
    })
})
