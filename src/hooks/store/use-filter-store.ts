import { create } from "zustand"

/** Filter store keys */
export type FilterMapKeys = "statistics" | "rooms" | "history" | "collections"

/** Filter types */
export type FilterValue = string | number | boolean

export type Filter<T> = Partial<{ [key in keyof T]: FilterValue }>

export type FilterOptions<T extends Pick<T, keyof T>> = {
  [key in keyof T]: T[key][]
}

/** Sort types */
export type SortKey = "asc" | "desc"

export type Sort<T> = Partial<{ [key in keyof T]: SortKey }>

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
  },
  collections: {
    filter: {},
    sort: {
      createdAt: 'desc'
    }
  }
}))

export const useFilterStore = <T extends Filter<T>>(
  selector: (state: FilterStore<T>) => FilterStore<T>[FilterMapKeys]['filter' | 'sort']
) => useFilterStoreImpl(selector)

export const setFilterStore = useFilterStoreImpl.setState as <T extends Filter<T>>(
  partial: (state: FilterStore<T>) => Partial<FilterStore<T>>,
  replace?: boolean
) => void
