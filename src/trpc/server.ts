import "server-only"

import { cache } from 'react'

import { createHydrationHelpers } from '@trpc/react-query/rsc'

import { createCaller, type AppRouter } from '@/server/api/_app'
import { createTRPCContext } from '@/server/api/trpc'
import { makeQueryClient } from '@/trpc/query-client'

const createContext = cache(() => {
  return createTRPCContext({ req: {} as Request })
})

const getQueryClient = cache(makeQueryClient)
const caller = createCaller(createContext)

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient,
)
