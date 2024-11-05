import { create } from "zustand"

/** Filter store keys */
export type FilterMapKeys = "statistics" | "rooms" | "history"

/** Filter types */
export type Filter<T> = Partial<{ [key in keyof T]: T[key] }>

export type FilterOptions<T extends Pick<T, keyof T>> = {
  [K in keyof T]: T[K][]
}

/** Sort types */
export type SortKey = "asc" | "desc"

export type Sort<T> = Partial<{ [key in keyof T]: SortKey }>

export type SortOption<T> = {
  sortValueKey: keyof T
  label: string
}

export type SortOptions<T> = {
  [K in keyof T]: SortOption<T>
}

/** Store types */
type FilterStore<T extends Filter<T>> = {
  [key in FilterMapKeys]: {
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
  selector: (state: FilterStore<T>) => FilterStore<T>[FilterMapKeys]
) => useFilterStoreImpl(selector)

export const setFilterStore = useFilterStoreImpl.setState as <T extends Filter<T>>(
  partial: (state: FilterStore<T>) => Partial<FilterStore<T>>,
  replace?: boolean
) => void
