import { z } from "zod"

// schemas
import { sortKeys } from "@/lib/schema"
import { clientPlayerSchema } from "@/lib/schema/player-schema"

/* Query filters */
export const playerFilterQuery = clientPlayerSchema.pick({
  id: true,
  tag: true,
  color: true,
  isActive: true
}).partial()

export const playerSortQuery = z.object({
  tag: sortKeys,
  createdAt: sortKeys
  // TODO: extend with stats?
}).partial()

export type PlayerFilterQuery = z.infer<typeof playerFilterQuery>
export type PlayerSortQuery = z.infer<typeof playerSortQuery>
