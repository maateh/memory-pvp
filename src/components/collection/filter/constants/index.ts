// types
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
