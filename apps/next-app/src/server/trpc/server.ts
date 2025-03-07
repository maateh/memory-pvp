import "server-only"

import { cache } from "react"
import { createHydrationHelpers } from "@trpc/react-query/rsc"

// types
import type { TRPCRouter } from "@/server/trpc/router"

// trpc
import { createTRPCContext } from "@/server/trpc"
import { createCaller } from "@/server/trpc/router"
import { makeQueryClient } from "@/server/trpc/query-client"

const createContext = cache(() => createTRPCContext({ req: {} as Request }))

const getQueryClient = cache(makeQueryClient)
const caller = createCaller(createContext)

export const { trpc, HydrateClient } = createHydrationHelpers<TRPCRouter>(
  caller,
  getQueryClient
)
