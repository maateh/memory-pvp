import { createCallerFactory, createTRPCRouter, publicProcedure } from "@/server/api/trpc"

// routers
import { playerRouter } from "./routers/player-router"

export const appRouter = createTRPCRouter({
  player: playerRouter
})

export const createCaller = createCallerFactory(appRouter)

export type AppRouter = typeof appRouter
