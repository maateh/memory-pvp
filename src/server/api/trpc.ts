import SuperJSON from 'superjson'

import { cache } from 'react'

// clerk
import { auth } from '@clerk/nextjs/server'

// trpc
import { initTRPC, TRPCError } from '@trpc/server'

// db
import { db } from '@/server/db'

export const createTRPCContext = cache(
  async (opts: { req: Request }) => {
    return { db, ...opts }
  }
)

const t = initTRPC
  .context<typeof createTRPCContext>()
  .create({ transformer: SuperJSON })

// MIDDLEWARES
const isProtected = t.middleware(async ({ ctx, next }) => {
  const { userId: clerkId } = auth()

  if (!clerkId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  const user = await ctx.db.user.findUnique({
    where: {
      clerkId
    }
  })

  if (!user) {
    throw new TRPCError({ code: 'NOT_FOUND' })
  }

  return next({
    ctx: { user }
  })
})

const hasActiveSession = t.middleware(async ({ ctx, next }) => {
  const { userId: clerkId } = auth()

  if (!clerkId) {
    return next({
      ctx: { activeSession: null }
    })
  }

  const activeSession = await ctx.db.gameSession.findFirst({
    select: {
      sessionOwnerId: true,
      sessionOwner: {
        select: {
          user: {
            select: { clerkId: true }
          }
        }
      }
    },
    where: {
      status: 'RUNNING',
      sessionOwner: {
        user: { clerkId }
      }
    }
  })

  if (activeSession) {
    throw new TRPCError({
      message: 'You cannot participate in two game sessions at once.',
      code: 'CONFLICT'
    })
  }

  return next({
    ctx: { activeSession }
  })
})

export const createCallerFactory = t.createCallerFactory
export const createTRPCRouter = t.router
export const createTRPCMiddleware = t.middleware

export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(isProtected)
export const gameProcedure = t.procedure.use(hasActiveSession)
