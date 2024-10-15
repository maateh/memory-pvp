import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc"

// routers
import { playerProfileRouter } from "./routers/player-router"
import { sessionRouter } from "./routers/session-router"

export const appRouter = createTRPCRouter({
  player: playerProfileRouter,
  session: sessionRouter
})

export const createCaller = createCallerFactory(appRouter)

export type AppRouter = typeof appRouter
