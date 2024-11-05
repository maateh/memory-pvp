import type { CardCollection } from "@prisma/client"
import type { Filter, Sort } from "@/hooks/store/use-filter-store"

/** Filter types */
export type CollectionFilterFields = Pick<CardCollection, 'name' | 'tableSize'> & { includeUser: boolean }

export type CollectionFilter = Filter<CollectionFilterFields>

/** Sort types */
export type CollectionSortFields = Pick<CardCollection, 'name' | 'createdAt'>

export type CollectionSort = Sort<CollectionSortFields>
