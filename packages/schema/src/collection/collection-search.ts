import { z } from "zod"

// schemas
import { clientCardCollection } from "@/collection"
import { sortKey } from "@/search"

export const collectionFilter = clientCardCollection
  .pick({
    id: true,
    name: true,
    description: true, // TODO: parser -> contains
    tableSize: true
  })
  .extend({
    userId: z.string(),
    username: z.string(),
    excludeUser: z.coerce.boolean().optional()
  })
  .partial()

export const collectionSort = z.record(
  clientCardCollection.pick({
    name: true,
    tableSize: true,
    createdAt: true,
    updatedAt: true
  }).keyof(),
  sortKey
)

export type CollectionFilter = z.infer<typeof collectionFilter>
export type CollectionSort = z.infer<typeof collectionSort>
