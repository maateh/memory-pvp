import { create } from "zustand"

// types
import type { Filter } from "@/lib/types/query"

/* Filter store keys */
export type FilterStoreKey = "statistics" | "rooms" | "history"

/* Store types */
type FilterStore<T> = {
  [K in FilterStoreKey]: Filter<T>
}

/** Filter store (generic) implementation */
const useFilterStoreImpl = create<FilterStore<any>>((_) => ({
  statistics: {},
  rooms: {},
  history: {}
}))

export const useFilterStore = <T>(
  selector: (state: FilterStore<T>) => FilterStore<T>[FilterStoreKey]
) => useFilterStoreImpl(selector)

export const setFilterStore = useFilterStoreImpl.setState as <T>(
  partial: (state: FilterStore<T>) => Partial<FilterStore<T>>,
  replace?: boolean
) => void
