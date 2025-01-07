// server
import { ApiError } from "@/server/_error"

// trpc
import { TRPCError } from "@trpc/server"
import { createTRPCRouter, protectedProcedure } from "@/server/trpc"

// validations
import { z } from "zod"
import { playerFilterQuery } from "@/lib/schema/query/player-query"
import { sessionFilterQuery } from "@/lib/schema/query/session-query"

export const playerProfileRouter = createTRPCRouter({
  getStats: protectedProcedure
    .input(z.object({
      playerFilter: playerFilterQuery,
      sessionFilter: sessionFilterQuery
    }))
    .query(async ({ ctx, input }) => {
      const { playerFilter, sessionFilter } = input
      const playerId = playerFilter.id

      if (!playerId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          cause: new ApiError({
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
    
      return sessions.reduce((sum, { stats, results }) => {
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
      } satisfies PrismaJson.PlayerStats)
    })
})
