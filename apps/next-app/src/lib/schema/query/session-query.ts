import { z } from "zod"

// schemas
import { sortKeys } from "@/lib/schema"
import { clientSessionSchema } from "@/lib/schema/session-schema"

/* Query filters */
export const sessionFilterQuery = clientSessionSchema.pick({
  slug: true,
  collectionId: true,
  status: true,
  type: true,
  mode: true,
  tableSize: true
}).extend({ playerId: z.string() }).partial()

export const sessionSortQuery = z.object({
  slug: sortKeys,
  type: sortKeys,
  mode: sortKeys,
  tableSize: sortKeys,
  status: sortKeys,
  startedAt: sortKeys,
  continuedAt: sortKeys,
  closedAt: sortKeys
}).partial()

export type SessionFilterQuery = z.infer<typeof sessionFilterQuery>
export type SessionSortQuery = z.infer<typeof sessionSortQuery>
