// trpc
import { createTRPCRouter, protectedProcedure } from "@/server/trpc"

// validations
import { sessionFilterQuery } from "@/lib/schema/query/session-query"

// utils
import { parseSessionFilter } from "@/lib/util/parser/session-parser"

export const sessionRouter = createTRPCRouter({
  count: protectedProcedure
    .input(sessionFilterQuery)
    .query(async ({ ctx, input }) => {
      return await ctx.db.gameSession.count({
        where: parseSessionFilter(ctx.user.id, input)
      })
    })
})
