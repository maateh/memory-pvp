// trpc
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"

export const userRouter = createTRPCRouter({
  getWithPlayerProfiles: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.db.user.findUnique({
        where: {
          id: ctx.user.id
        },
        include: {
          playerProfiles: true
        }
      })
    })
})
