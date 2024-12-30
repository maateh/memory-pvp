import { z } from "zod"

// schemas
import { sortKeys } from "@/lib/schema"
import { clientSessionSchema } from "@/lib/schema/session-schema"

/* Query filters */
export const sessionFilterSchema = clientSessionSchema.pick({
  slug: true,
  collectionId: true,
  status: true,
  type: true,
  mode: true,
  tableSize: true
}).extend({ playerId: z.string() }).partial()

export const sessionSortSchema = z.object({
  slug: sortKeys,
  type: sortKeys,
  mode: sortKeys,
  tableSize: sortKeys,
  status: sortKeys,
  startedAt: sortKeys,
  continuedAt: sortKeys,
  closedAt: sortKeys
}).partial()
