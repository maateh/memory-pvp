import { z } from "zod"

// schemas
import { sortKeys } from "@/lib/schema/query"
import { baseClientSession } from "@repo/schema/session"

/* Query filters */
export const sessionFilterQuery = baseClientSession
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

export const sessionSortQuery = z.record(
  baseClientSession.pick({
    slug: true,
    mode: true,
    format: true,
    tableSize: true,
    status: true,
    startedAt: true,
    closedAt: true
  }).keyof(),
  sortKeys
)

export type SessionFilterQuery = z.infer<typeof sessionFilterQuery>
export type SessionSortQuery = z.infer<typeof sessionSortQuery>
