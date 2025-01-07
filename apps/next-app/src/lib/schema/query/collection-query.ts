import { z } from "zod"

// schemas
import { sortKeys } from "@/lib/schema"
import { clientCollectionSchema } from "@/lib/schema/collection-schema"

/* Query filters */
export const collectionFilterQuery = clientCollectionSchema.pick({
  name: true,
  tableSize: true
}).extend({
  username: z.string(),
  excludeUser: z.coerce.boolean().optional()
}).partial()

export const collectionSortQuery = z.object({
  name: sortKeys,
  tableSize: sortKeys,
  createdAt: sortKeys,
  updatedAt: sortKeys
}).partial()

export type CollectionFilterQuery = z.infer<typeof collectionFilterQuery>
export type CollectionSortQuery = z.infer<typeof collectionSortQuery>
