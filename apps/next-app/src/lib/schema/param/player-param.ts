import { z } from "zod"

// schemas
import { sortKeys } from "@/lib/schema"
import { clientPlayerSchema } from "@/lib/schema/player-schema"

/* Query filters */
export const playerFilterSchema = clientPlayerSchema.pick({
  id: true,
  tag: true,
  color: true,
  isActive: true
}).partial()

export const playerSortSchema = z.object({
  tag: sortKeys,
  createdAt: sortKeys
  // TODO: extend with stats?
}).partial()
