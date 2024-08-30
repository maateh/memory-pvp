import { z } from "zod"

import { createCallerFactory, createTRPCRouter, publicProcedure } from "@/server/api/trpc"

// routers
import { playerRouter } from "./routers/player-router"

export const appRouter = createTRPCRouter({
  player: playerRouter,
  hello: publicProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      }
    }),
})

export const createCaller = createCallerFactory(appRouter)

export type AppRouter = typeof appRouter
