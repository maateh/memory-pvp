import { z } from "zod"

// schemas
import { clientSession } from "@/session"
import { sortKey } from "@/search"

export const sessionFilter = clientSession
  .pick({
    slug: true,
    collectionId: true,
    status: true,
    mode: true,
    format: true,
    tableSize: true
  })
  .extend({
    ownerId: z.string(),
    guestId: z.string()
  })
  .partial()

export const sessionSort = z.record(
  clientSession.pick({
    slug: true,
    mode: true,
    format: true,
    tableSize: true,
    status: true,
    // TODO: extend with stats (?)
    // stats: true
    startedAt: true,
    closedAt: true
  }).keyof(),
  sortKey
)

export type SessionFilter = z.infer<typeof sessionFilter>
export type SessionSort = z.infer<typeof sessionSort>
