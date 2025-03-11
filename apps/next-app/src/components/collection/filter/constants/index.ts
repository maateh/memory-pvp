// types
import type { SortOptions } from "@/lib/types/query"
import type { CollectionSort } from "../types"

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
