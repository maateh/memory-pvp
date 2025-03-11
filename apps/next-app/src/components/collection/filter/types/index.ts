import type { Filter, Sort } from "@/lib/types/query"
import type { CollectionFilterQuery, CollectionSortQuery } from "@/lib/schema/query/collection-query"

/* Filter types */
export type CollectionFilterFields = Required<CollectionFilterQuery>
export type CollectionFilter = Filter<CollectionFilterFields>

/* Sort types */
export type CollectionSortFields = Required<CollectionSortQuery>
export type CollectionSort = Sort<CollectionSortFields>
