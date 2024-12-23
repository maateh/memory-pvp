// types
import type { SessionSort } from "../types"

export const sessionSortOptions: SortOptions<SessionSort> = {
  slug: {
    sortValueKey: 'slug',
    label: 'Session'
  },
  type: {
    sortValueKey: 'type',
    label: 'Type / Mode'
  },
  tableSize: {
    sortValueKey: 'tableSize',
    label: 'Table size'
  },
  startedAt: {
    sortValueKey: 'startedAt',
    label: 'Started at'
  },
  closedAt: {
    sortValueKey: 'closedAt',
    label: 'Closed at'
  }
}
