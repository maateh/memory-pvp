import type { CardCollection } from "@prisma/client"
import type { Filter, Sort } from "@/hooks/store/use-filter-store"

export type CollectionFilterFields = Pick<CardCollection, 'name' | 'tableSize'> & { includeUser: boolean }

export type CollectionFilter = Filter<CollectionFilterFields>

export type CollectionSortFields = Pick<CardCollection, 'createdAt'>

export type CollectionSort = Sort<CollectionSortFields>
