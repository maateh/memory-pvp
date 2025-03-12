// types
import type { SortOptions } from "@/lib/types/query"
import type { PlayerSort } from "../types"

export const playerSortOptions: SortOptions<PlayerSort> = {
  tag: {
    sortValueKey: "tag",
    label: "Player tag"
  },
  createdAt: {
    sortValueKey: "createdAt",
    label: "Created at"
  }
}
