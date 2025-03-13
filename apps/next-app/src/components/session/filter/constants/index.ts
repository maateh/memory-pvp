// types
import type { SessionSort } from "@repo/schema/session"
import type { SortOptions } from "@/lib/types/search"

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
