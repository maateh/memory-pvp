import { createCallerFactory, createTRPCRouter, publicProcedure } from "@/server/api/trpc"

// routers
import { userRouter } from "./routers/user-router"
import { playerProfileRouter } from "./routers/player-profile-router"

export const appRouter = createTRPCRouter({
  user: userRouter,
  playerProfile: playerProfileRouter
})

export const createCaller = createCallerFactory(appRouter)

export type AppRouter = typeof appRouter
