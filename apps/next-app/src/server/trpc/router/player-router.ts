// server
import { ServerError } from "@repo/server/error"

// trpc
import { TRPCError } from "@trpc/server"
import { createTRPCRouter, protectedProcedure } from "@/server/trpc"

// validations
import { playerGetStatsValidation } from "@repo/schema/player-validation"

export const playerProfileRouter = createTRPCRouter({
  getStats: protectedProcedure
    .input(playerGetStatsValidation)
    .query(async ({ ctx, input }) => {
      // FIXME: parse filters
      const { playerFilter, sessionFilter } = input
      const playerId = playerFilter.id

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
        where: {
          ...sessionFilter,
          OR: [
            { owner: { userId: ctx.user.id, ...playerFilter } },
            { guest: { userId: ctx.user.id, ...playerFilter } }
          ]
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
          totalTime: sum.totalTime + stats.timer,
          avgTime: 0, // TODO: calculate `avgTime`
          flips: sum.flips + stats.flips[playerId],
          matches: sum.matches + stats.matches[playerId]
        }
      }, {
        sessions: sessions.length,
        elo: 0,
        totalTime: 0,
        avgTime: 0,
        flips: 0,
        matches: 0
      } satisfies PrismaJson.PlayerStats)

      return playerStats
    })
})
