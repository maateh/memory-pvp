import SuperJSON from 'superjson'

import { cache } from 'react'

// trpc
import { initTRPC, TRPCError } from '@trpc/server'

// db
import { db } from '@/server/db'
import { currentProfile } from '@/server/db/current-profile'

export const createTRPCContext = cache(
  async (opts: { req: Request }) => {
    return { db, ...opts }
  }
)

const t = initTRPC
  .context<typeof createTRPCContext>()
  .create({
    transformer: SuperJSON
  })

const isAuth = t.middleware(async ({ ctx, next }) => {
  const profile = await currentProfile()

  if (!profile) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return next({
    ctx: { profile }
  })
})

export const createCallerFactory = t.createCallerFactory
export const createTRPCRouter = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(isAuth)
