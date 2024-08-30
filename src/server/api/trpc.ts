import { cache } from 'react'

// trpc
import { initTRPC, TRPCError } from '@trpc/server'

// clerk
import { currentUser } from '@clerk/nextjs/server'

// lib
import { db } from '@/lib/db'

export const createTRPCContext = cache(async (opts: { req: Request }) => {
  return { db, ...opts }
})

const t = initTRPC.context<typeof createTRPCContext>().create({})

const isAuth = t.middleware(async ({ ctx, next }) => {
  const user = await currentUser()

  if (!user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return next({
    ctx: { user }
  })
})

export const createCallerFactory = t.createCallerFactory
export const createTRPCRouter = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(isAuth)
