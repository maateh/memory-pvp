import { z } from "zod"

// schemas
import { sortKeys } from "@/lib/schema"
import { clientCollectionSchema } from "@/lib/schema/collection-schema"

/* Query filters */
export const collectionFilterSchema = clientCollectionSchema.pick({
  name: true,
  tableSize: true
}).extend({
  username: z.string(),
  excludeUser: z.coerce.boolean().optional()
}).partial()

export const collectionSortSchema = z.object({
  name: sortKeys,
  tableSize: sortKeys,
  createdAt: sortKeys,
  updatedAt: sortKeys
}).partial()

export type CollectionFilterQuery = z.infer<typeof collectionFilterSchema>
export type CollectionSortQuery = z.infer<typeof collectionSortSchema>
