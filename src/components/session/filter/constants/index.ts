// types
import type { SessionSort } from "../types"

export const sessionSortOptions: SortOptions<SessionSort> = {
  startedAt: {
    sortValueKey: 'startedAt',
    label: 'Started at'
  },
  closedAt: {
    sortValueKey: 'closedAt',
    label: 'Closed at'
  }
}
