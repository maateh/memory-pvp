// trpc
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"

// validations
import { sessionFilterSchema } from "@/lib/validations/session-schema"

// helpers
import { parseSessionFilter } from "@/lib/helpers/session"

export const sessionRouter = createTRPCRouter({
  count: protectedProcedure
    .input(sessionFilterSchema)
    .query(async ({ ctx, input }) => {
      const filter = parseSessionFilter(ctx.user.id, input)

      return await ctx.db.gameSession.count({ where: filter })
    })
})
