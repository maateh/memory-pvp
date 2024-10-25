import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc"

// routers
import { playerProfileRouter } from "./routers/player-router"
import { sessionRouter } from "./routers/session-router"
import { collectionRouter } from "./routers/collection-router"

export const appRouter = createTRPCRouter({
  player: playerProfileRouter,
  session: sessionRouter,
  collection: collectionRouter
})

export const createCaller = createCallerFactory(appRouter)

export type AppRouter = typeof appRouter
