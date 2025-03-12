// types
import type { SortOptions } from "@/lib/types/query"
import type { SessionSort } from "../types"

export const sessionSortOptions: SortOptions<SessionSort> = {
  slug: {
    sortValueKey: "slug",
    label: "Session"
  },
  mode: {
    sortValueKey: "mode",
    label: "Settings"
  },
  tableSize: {
    sortValueKey: "tableSize",
    label: "Table size"
  },
  startedAt: {
    sortValueKey: "startedAt",
    label: "Started at"
  },
  closedAt: {
    sortValueKey: "closedAt",
    label: "Closed at"
  }
}
