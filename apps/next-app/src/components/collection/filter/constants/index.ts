// types
import type { CollectionSort } from "@repo/schema/collection"
import type { SortOptions } from "@/lib/types/search"

export const collectionSortOptions: SortOptions<CollectionSort> = {
  name: {
    sortValueKey: "name",
    label: "Name"
  },
  tableSize: {
    sortValueKey: "tableSize",
    label: "Size"
  },
  createdAt: {
    sortValueKey: "createdAt",
    label: "Created at"
  },
  updatedAt: {
    sortValueKey: "updatedAt",
    label: "Updated at"
  }
}
