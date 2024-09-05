// trpc
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc"

// validations
import { userSchema, userDeleteSchema } from "@/lib/validations"

export const userRouter = createTRPCRouter({
  get: protectedProcedure
    .query(({ ctx }) => ctx.user),

  create: publicProcedure
    .input(userSchema)
    .mutation(async ({ ctx, input }) => {
      const { clerkId, email, username, imageUrl } = input

      return await ctx.db.user.create({
        data: {
          clerkId,
          username,
          email,
          imageUrl
        }
      })
    }),

  update: publicProcedure
    .input(userSchema)
    .mutation(async ({ ctx, input }) => {
      const { clerkId, email, username, imageUrl } = input

      return await ctx.db.user.update({
        where: {
          clerkId
        },
        data: {
          username,
          email,
          imageUrl
        }
      })
    }),

  delete: publicProcedure
    .input(userDeleteSchema)
    .mutation(async ({ ctx, input }) => {
      const { clerkId } = input

      return await ctx.db.user.delete({
        where: {
          clerkId
        }
      })
    })
})
