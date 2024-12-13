import SuperJSON from 'superjson'

import { cache } from 'react'

// clerk
import { auth } from '@clerk/nextjs/server'

// trpc
import { initTRPC, TRPCError } from '@trpc/server'

// server
import { ApiError } from '@/server/_error'
import { db } from '@/server/db'
import { redis } from "@/server/redis"

export const createTRPCContext = cache(
  async (opts: { req: Request }) => {
    return { db, redis, ...opts }
  }
)

const t = initTRPC
  .context<typeof createTRPCContext>()
  .create({
    transformer: SuperJSON,
    errorFormatter({ shape, error }) {
      return {
        ...shape,
        cause: { ...error.cause as ApiError }
      }
    }
  })

export const createCallerFactory = t.createCallerFactory
export const createTRPCRouter = t.router
export const createTRPCMiddleware = t.middleware

export const publicProcedure = t.procedure

export const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const { userId: clerkId } = auth()

  if (!clerkId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      cause: new ApiError({
        key: 'CLERK_UNAUTHORIZED',
        message: 'You are not signed in to your account.'
      })
    })
  }

  const user = await ctx.db.user.findUnique({
    where: {
      clerkId
    }
  })

  if (!user) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      cause: new ApiError({
        key: 'USER_NOT_FOUND',
        message: "No user data found in the database.",
        description: "Please try to remove your Clerk account and repeat the registration process."
      })
    })
  }

  return next({
    ctx: { user }
  })
})
