import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

// trpc
import { createTRPCContext } from '@/server/api/trpc'
import { appRouter } from '@/server/api/_app'

const handler = (req: Request) => fetchRequestHandler({
  endpoint: '/api/trpc',
  req,
  router: appRouter,
  createContext: () => createTRPCContext({ req }),
})

export { handler as GET, handler as POST }
