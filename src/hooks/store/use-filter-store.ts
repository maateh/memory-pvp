import { create } from "zustand"

/** Filter map */
export type FilterMapKeys = "history"

/** Filter types */
export type FilterFields<T, K extends keyof T> = Pick<T, K>

export type FilterOptions<T extends FilterFields<T, keyof T>> = {
  [key in keyof T]: T[key][]
}

type Filter<T extends FilterFields<T, keyof T>> = Partial<T>

/** Sort types */
export type SortFields<T, K extends keyof T> = Pick<{
  [key in K]: 'asc' | 'desc'
}, K>

type Sort<T extends SortFields<T, keyof T>> = Partial<T>

/** Store types */
type FilterStore<T extends FilterFields<T, keyof T>> = {
  [key in FilterMapKeys]: {
    filter: Filter<T>
    sort: Sort<T>
  }
}

/** Filter store (generic) implementation */
const useFilterStoreImpl = create<FilterStore<any>>((_) => ({
  history: {
    filter: {},
    sort: {
      startedAt: 'desc'
    }
  }
}))

export const useFilterStore = <T extends FilterFields<T, keyof T>>(
  selector: (state: FilterStore<T>) => FilterStore<T>[FilterMapKeys]['filter' |'sort']
) => useFilterStoreImpl(selector)

export const setFilterStore = useFilterStoreImpl.setState as <T extends FilterFields<T, keyof T>>(
  partial: (state: FilterStore<T>) => Partial<FilterStore<T>>,
  replace?: boolean
) => void
