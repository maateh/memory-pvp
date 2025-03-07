import { createCallerFactory, createTRPCRouter } from "@/server/trpc"

// routers
import { playerProfileRouter } from "./player-router"
import { sessionRouter } from "./session-router"

export const trpcRouter = createTRPCRouter({
  player: playerProfileRouter,
  session: sessionRouter
})

export const createCaller = createCallerFactory(trpcRouter)

export type TRPCRouter = typeof trpcRouter
