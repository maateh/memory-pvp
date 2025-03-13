// types
import type { SessionSort } from "@repo/schema/session"
import type { SortOptions } from "@/lib/types/search"

export const sessionSortOptions: SortOptions<SessionSort> = {
  slug: {
    sortValueKey: "slug",
    label: "Session"
  },
  status: {
    sortValueKey: "status",
    label: "Status"
  },
  mode: {
    sortValueKey: "mode",
    label: "Settings"
  },
  format: {
    sortValueKey: "format",
    label: "Match format"
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
