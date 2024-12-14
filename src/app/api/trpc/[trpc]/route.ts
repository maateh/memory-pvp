import { fetchRequestHandler } from "@trpc/server/adapters/fetch"

// trpc
import { createTRPCContext } from "@/server/trpc"
import { trpcRouter } from "@/server/trpc/router"

const handler = (req: Request) => fetchRequestHandler({
  endpoint: "/api/trpc",
  req,
  router: trpcRouter,
  createContext: () => createTRPCContext({ req }),
})

export {
  handler as GET,
  handler as POST
}
