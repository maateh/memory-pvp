import type { z } from "zod"
import type { collectionFilterSchema, collectionSortSchema } from "@/lib/schema/param/collection-param"

/* Filter types */
export type CollectionFilterFields = Required<z.infer<typeof collectionFilterSchema>>

export type CollectionFilter = Filter<CollectionFilterFields>

/* Sort types */
export type CollectionSortFields = Required<z.infer<typeof collectionSortSchema>>

export type CollectionSort = Sort<CollectionSortFields>
