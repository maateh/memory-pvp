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

export const createCallerFactory = t.createCallerFactory
export const createTRPCRouter = t.router
export const createTRPCMiddleware = t.middleware

export const publicProcedure = t.procedure

export const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
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

export const gameProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const playerProfile = await ctx.db.playerProfile.findFirst({
    where: {
      userId: ctx.user.id,
      isActive: true
    }
  })

  if (!playerProfile) {
    throw new TRPCError({
      message: 'Player profile not found',
      code: 'NOT_FOUND'
    })
  }

  const activeSession = await ctx.db.gameSession.findFirst({
    where: {
      status: 'RUNNING',
      ownerId: playerProfile.id
    },
    include: {
      owner: {
        include: {
          user: {
            select: { imageUrl: true }
          }
        }
      },
      guest: {
        include: {
          user: {
            select: { imageUrl: true }
          }
        }
      }
    }
  })

  return next({
    ctx: { playerProfile, activeSession }
  })
})

export const protectedGameProcedure = gameProcedure.use(async ({ ctx, next }) => {
  if (!ctx.activeSession || ctx.activeSession.status !== 'RUNNING') {
    throw new TRPCError({
      message: "You aren't currently participating in any game session.",
      code: 'NOT_FOUND'
    })
  }

  if (
    ctx.activeSession.owner.userId !== ctx.user.id &&
    ctx.activeSession.guest?.userId !== ctx.user.id
  ) {
    throw new TRPCError({
      message: "You don't have access to this game session.",
      code: 'FORBIDDEN'
    })
  }

  return next({
    ctx: { activeSession: ctx.activeSession }
  })
})
