import SuperJSON from 'superjson'

import { cache } from 'react'

// clerk
import { currentUser as currentClerkUser } from "@clerk/nextjs/server"

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

/* MIDDLEWARES */
const isAuth = t.middleware(async ({ next }) => {
  const clerkUser = await currentClerkUser()

  if (!clerkUser) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return next({
    ctx: { clerkUser }
  })
})

const isProtected = t.middleware(async ({ ctx, next }) => {
  const clerkUser = await currentClerkUser()

  if (!clerkUser) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  const user = await ctx.db.user.findUnique({
    where: {
      clerkId: clerkUser.id
    }
  })

  if (!user) {
    throw new TRPCError({ code: 'NOT_FOUND' })
  }

  return next({
    ctx: { user }
  })
})

export const createCallerFactory = t.createCallerFactory
export const createTRPCRouter = t.router
export const addTRPCMiddleware = t.middleware
export const publicProcedure = t.procedure
export const authProcedure = t.procedure.use(isAuth)
export const protectedProcedure = t.procedure.use(isProtected)
