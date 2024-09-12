import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc"

// routers
import { playerProfileRouter } from "./routers/player-profile-router"
import { gameRouter } from "./routers/game-router"

export const appRouter = createTRPCRouter({
  playerProfile: playerProfileRouter,
  game: gameRouter
})

export const createCaller = createCallerFactory(appRouter)

export type AppRouter = typeof appRouter
