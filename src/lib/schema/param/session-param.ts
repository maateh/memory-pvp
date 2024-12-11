import { z } from "zod"

// schemas
import { clientSessionSchema } from "@/lib/schema/session-schema"

/* Query filters */
export const sessionFilterSchema = clientSessionSchema
  .extend({ playerId: z.string() })
  .omit({
    stats: true,
    cards: true,
    flipped: true,
    players: true,
    startedAt: true,
    continuedAt: true,
    closedAt: true
  }).partial().optional().default({})

const sortKeys = z.enum(['asc', 'desc']).optional()
export const sessionSortSchema = z.object({
  slug: sortKeys,
  type: sortKeys,
  mode: sortKeys,
  tableSize: sortKeys,
  status: sortKeys,
  startedAt: sortKeys,
  continuedAt: sortKeys,
  closedAt: sortKeys
}).partial().optional().default({})
