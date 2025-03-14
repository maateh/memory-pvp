// trpc
import { createTRPCRouter, protectedProcedure } from "@/server/trpc"

// validations
import { sessionCountValidation } from "@repo/schema/session-validation"

// utils
import { parseSessionFilter } from "@/lib/util/parser/session-parser"

export const sessionRouter = createTRPCRouter({
  count: protectedProcedure
    .input(sessionCountValidation)
    .query(async ({ ctx, input }) => {
      const { filter } = input

      return await ctx.db.gameSession.count({
        where: parseSessionFilter(ctx.user.id, filter)
      })
    })
})
