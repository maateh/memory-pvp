import SuperJSON from 'superjson'

import { cache } from 'react'

// clerk
import { auth } from '@clerk/nextjs/server'

// trpc
import { initTRPC } from '@trpc/server'
import { TRPCApiError } from '@/trpc/error'

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
    throw new TRPCApiError({
      key: 'CLERK_UNAUTHORIZED',
      code: 'UNAUTHORIZED',
      message: 'You are not signed in to your account.'
    })
  }

  const user = await ctx.db.user.findUnique({
    where: {
      clerkId
    }
  })

  if (!user) {
    throw new TRPCApiError({
      key: 'USER_NOT_FOUND',
      code: 'NOT_FOUND',
      message: "No user data found in the database.",
      description: "Please try to remove your Clerk account and repeat the registration process."
    })
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
    throw new TRPCApiError({
      key: 'PLAYER_PROFILE_NOT_FOUND',
      code: 'NOT_FOUND',
      message: 'Active player profile not found.'
    })
  }

  return next({
    ctx: { playerProfile }
  })
})

export const protectedGameProcedure = gameProcedure.use(async ({ ctx, next }) => {
  const activeSession = await ctx.db.gameSession.findFirst({
    where: {
      status: 'RUNNING',
      ownerId: ctx.playerProfile.id
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

  if (!activeSession) {
    throw new TRPCApiError({
      key: 'SESSION_NOT_FOUND',
      code: 'NOT_FOUND',
      message: 'Game session not found.',
      description: "You aren't currently participating in any game session."
    })
  }

  if (
    activeSession.owner.userId !== ctx.user.id &&
    activeSession.guest?.userId !== ctx.user.id
  ) {
    throw new TRPCApiError({
      key: 'SESSION_NOT_FOUND',
      code: 'FORBIDDEN',
      message: "Game session access denied.",
      description: "You don't have access to this game session."
    })
  }

  return next({
    ctx: { activeSession }
  })
})
