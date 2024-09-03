// trpc
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc"

// validations
import { userSchema, userDeleteSchema } from "@/lib/validations"

export const userRouter = createTRPCRouter({
  get: protectedProcedure
    .query(({ ctx }) => ctx.user),

  create: publicProcedure
    .input(userSchema)
    .query(async ({ ctx, input }) => {
      const { clerkId, email, username, imageUrl } = input

      return ctx.db.user.create({
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
    .query(async ({ ctx, input }) => {
      const { clerkId, email, username, imageUrl } = input

      return ctx.db.user.update({
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
    .query(async ({ ctx, input }) => {
      const { clerkId } = input

      return ctx.db.user.delete({
        where: {
          clerkId
        }
      })
    }),

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
