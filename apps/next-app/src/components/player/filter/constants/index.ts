// types
import type { PlayerSort } from "@repo/schema/player"
import type { SortOptions } from "@/lib/types/search"

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
