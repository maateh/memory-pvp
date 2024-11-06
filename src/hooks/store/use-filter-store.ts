import { create } from "zustand"

/** Filter store keys */
export type FilterStoreKey = "statistics" | "rooms" | "history"

/** Store types */
type FilterStore<T extends Filter<T>> = {
  [key in FilterStoreKey]: {
    filter: Filter<T>
    sort: Sort<T>
  }
}

/** Filter store (generic) implementation */
const useFilterStoreImpl = create<FilterStore<any>>((_) => ({
  statistics: {
    filter: {},
    sort: {}
  },
  rooms: {
    filter: {},
    sort: {}
  },
  history: {
    filter: {},
    sort: {
      startedAt: 'desc'
    }
  }
}))

export const useFilterStore = <T extends Filter<T>>(
  selector: (state: FilterStore<T>) => FilterStore<T>[FilterStoreKey]
) => useFilterStoreImpl(selector)

export const setFilterStore = useFilterStoreImpl.setState as <T extends Filter<T>>(
  partial: (state: FilterStore<T>) => Partial<FilterStore<T>>,
  replace?: boolean
) => void
