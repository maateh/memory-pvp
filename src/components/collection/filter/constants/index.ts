// types
import type { SortOptions } from "@/hooks/store/use-filter-store"
import type { CollectionSort } from "../types"

export const collectionSortOptions: SortOptions<CollectionSort> = {
  name: {
    sortValueKey: 'name',
    label: 'Name'
  },
  createdAt: {
    sortValueKey: 'createdAt',
    label: 'Created at'
  }
}
