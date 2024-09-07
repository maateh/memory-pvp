import { createCallerFactory, createTRPCRouter, publicProcedure } from "@/server/api/trpc"

// routers
import { userRouter } from "./routers/user-router"
import { playerProfileRouter } from "./routers/player-profile-router"
import { gameRouter } from "./routers/game-router"

export const appRouter = createTRPCRouter({
  user: userRouter,
  playerProfile: playerProfileRouter,
  game: gameRouter
})

export const createCaller = createCallerFactory(appRouter)

export type AppRouter = typeof appRouter
