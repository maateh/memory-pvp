import { z } from "zod"

// schemas
import { clientPlayer } from "@/player"
import { clientSession } from "@/session"

export const clientResult = z.object({
  id: z.string(),
  player: clientPlayer,
  session: clientSession.pick({
    slug: true,
    mode: true,
    format: true,
    tableSize: true,
    stats: true,
    startedAt: true
  }),

  gainedElo: z.coerce.number(),
  flips: z.coerce.number(),
  matches: z.coerce.number(),
  timer: z.coerce.number(),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
})

export type ClientResult = z.infer<typeof clientResult>
