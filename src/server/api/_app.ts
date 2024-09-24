import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc"

// routers
import { playerProfileRouter } from "./routers/player-profile-router"
import { sessionRouter } from "./routers/session-router"

export const appRouter = createTRPCRouter({
  playerProfile: playerProfileRouter,
  session: sessionRouter
})

export const createCaller = createCallerFactory(appRouter)

export type AppRouter = typeof appRouter
