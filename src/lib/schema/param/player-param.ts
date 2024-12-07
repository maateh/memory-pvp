import { z } from "zod"

// schemas
import { clientPlayerSchema } from "@/lib/schema/player-schema"

/* Query filters */
export const playerFilterSchema = clientPlayerSchema.omit({
  stats: true,
  imageUrl: true,
  createdAt: true,
  updatedAt: true
}).partial().optional().default({})

const sortKeys = z.enum(['asc', 'desc']).optional()
export const playerSortSchema = z.object({
  tag: sortKeys,
  createdAt: sortKeys
  // TODO: extend with stats?
}).partial().optional().default({})
