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

export const playerProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const player = await ctx.db.playerProfile.findFirst({
    where: {
      userId: ctx.user.id,
      isActive: true
    }
  })

  if (!player) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      cause: new TRPCApiError({
        key: 'PLAYER_PROFILE_NOT_FOUND',
        message: 'Active player profile not found.'
      })
    })
  }

  return next({
    ctx: { player }
  })
})

export const protectedSessionProcedure = playerProcedure.use(async ({ ctx, next }) => {
  const activeSession = await ctx.db.gameSession.findFirst({
    where: {
      status: 'RUNNING',
      players: {
        some: {
          id: ctx.player.id
        }
      }
    },
    include: {
      owner: true,
      players: {
        include: {
          user: {
            select: { imageUrl: true }
          }
        }
      }
    }
  })

  if (!activeSession) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      cause: new TRPCApiError({
        key: 'SESSION_NOT_FOUND',
        message: 'Game session not found.',
        description: "You aren't currently participating in any game session."
      })
    })
  }

  const hasAccess = activeSession.players.find((player) => player.userId === ctx.user.id)
  if (!hasAccess) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      cause: new TRPCApiError({
        key: 'SESSION_ACCESS_DENIED',
        message: "Game session access denied.",
        description: "You don't have access to this game session."
      })
    })
  }

  return next({
    ctx: { activeSession }
  })
})
