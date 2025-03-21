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
  .extend({ playerId: z.string() })
  .partial()

export const sessionFormFilter = sessionFilter
  .pick({
    mode: true,
    format: true,
    tableSize: true,
    collectionId: true
  })

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
export type SessionFormFilter = z.infer<typeof sessionFormFilter>
export type SessionSort = z.infer<typeof sessionSort>
