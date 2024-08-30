// trpc
import { createTRPCReact } from "@trpc/react-query"

import { AppRouter } from "@/server/api/_app"

export const api = createTRPCReact<AppRouter>()
