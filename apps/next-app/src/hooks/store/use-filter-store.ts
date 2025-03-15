import { create } from "zustand"

// types
import type { Filter, FilterPattern } from "@/lib/types/search"

/* Filter store keys */
export type FilterStoreKey = "statistics" | "rooms" | "history"

/* Store types */
type FilterStore<F extends FilterPattern> = Record<FilterStoreKey, Filter<F>>

/* Generic filter store implementation */
const useFilterStoreImpl = create<FilterStore<any>>((_) => ({
  statistics: {},
  rooms: {},
  history: {}
}))

export const useFilterStore = <F extends FilterPattern>(
  selector: (state: FilterStore<F>) => FilterStore<F>[FilterStoreKey]
) => useFilterStoreImpl(selector)

export const setFilterState = useFilterStoreImpl.setState as <F extends FilterPattern>(
  partial: (state: FilterStore<F>) => Partial<FilterStore<F>>,
  replace?: boolean
) => void
