import SuperJSON from 'superjson'

import { cache } from 'react'

// clerk
import { auth } from '@clerk/nextjs/server'

// trpc
import { initTRPC, TRPCError } from '@trpc/server'
import { TRPCApiError } from '@/trpc/error'

// db
import { db } from '@/server/db'

// redis
import { redis } from "@/lib/redis"

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
        cause: { ...error.cause as TRPCApiError }
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
      cause: new TRPCApiError({
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
      cause: new TRPCApiError({
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
