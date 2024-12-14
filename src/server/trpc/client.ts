// trpc
import { createTRPCReact } from "@trpc/react-query"

import { TRPCRouter } from "@/server/trpc/router"

export const trpc = createTRPCReact<TRPCRouter>()
