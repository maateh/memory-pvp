// trpc
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"

// validations
import { sessionFilterSchema } from "@/lib/schema/session-schema"

// utils
import { parseSessionFilter } from "@/lib/utils/parser/session-parser"

export const sessionRouter = createTRPCRouter({
  count: protectedProcedure
    .input(sessionFilterSchema)
    .query(async ({ ctx, input }) => {
      return await ctx.db.gameSession.count({
        where: parseSessionFilter(ctx.user.id, input)
      })
    })
})
