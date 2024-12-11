import { z } from "zod"

// schemas
import { clientPlayerSchema } from "@/lib/schema/player-schema"
import { sortKeys } from "@/lib/schema"

/* Query filters */
export const playerFilterSchema = clientPlayerSchema.omit({
  stats: true,
  imageUrl: true,
  createdAt: true,
  updatedAt: true
}).partial()

export const playerSortSchema = z.object({
  tag: sortKeys,
  createdAt: sortKeys
  // TODO: extend with stats?
}).partial()
