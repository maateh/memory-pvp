// trpc
import { authProcedure, createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc"

// validations
import { userCreateSchema, userDeleteSchema, userUpdateSchema } from "@/lib/validations"

export const userRouter = createTRPCRouter({
  get: protectedProcedure
    .query(({ ctx }) => ctx.user),

  create: publicProcedure
    .input(userCreateSchema)
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

  update: authProcedure
    .input(userUpdateSchema)
    .query(async ({ ctx, input }) => {
      const { email, username, imageUrl } = input

      return ctx.db.user.update({
        where: {
          clerkId: ctx.clerkUser.id
        },
        data: {
          username,
          email,
          imageUrl
        }
      })
    }),

  delete: authProcedure
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
