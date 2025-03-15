import { z } from "zod"

// schemas
import { clientPlayer } from "@/player"
import { sortKey } from "@/search"

export const playerFilter = clientPlayer
  .pick({
    id: true,
    tag: true,
    color: true
  })
  .extend({ isActive: z.boolean() })
  .partial()

export const playerSort = z.record(
  clientPlayer.pick({
    tag: true,
    createdAt: true,
    // TODO: extend with stats (?)
    // stats: true
  }).keyof(),
  sortKey
)

export type PlayerFilter = z.infer<typeof playerFilter>
export type PlayerSort = z.infer<typeof playerSort>
