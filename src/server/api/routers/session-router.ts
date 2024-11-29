// trpc
import {
  createTRPCRouter,
  activeSessionProcedure,
  protectedProcedure
} from "@/server/api/trpc"

// validations
import { sessionFilterSchema } from "@/lib/validations/session-schema"

// helpers
import {
  parseSchemaToClientSession,
  parseSessionFilter
} from "@/lib/helpers/session"

export const sessionRouter = createTRPCRouter({
  count: protectedProcedure
    .input(sessionFilterSchema)
    .query(async ({ ctx, input }) => {
      const filter = parseSessionFilter(ctx.user.id, input)

      return await ctx.db.gameSession.count({ where: filter })
    }),

  getActive: activeSessionProcedure
    .query(async ({ ctx }): Promise<ClientGameSession> => {
      let clientSession: ClientGameSession | null = await ctx.redis.get(
        `session:${ctx.activeSession.slug}`
      )

      if (!clientSession) {
        clientSession = parseSchemaToClientSession(
          ctx.activeSession,
          ctx.player.id
        )
      }

      return clientSession
    })
})
