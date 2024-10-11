import { create } from "zustand"

export type FilterKeys<T, K extends keyof T> = K

export type FilterFields<T, K extends keyof T> = Pick<T, FilterKeys<T, K>>

export type FilterOptions<T extends FilterFields<T, keyof T>> = {
  [key in keyof T]: T[key][]
}

type Filter<T extends FilterFields<T, keyof T> | unknown> = Partial<T>

export type FilterStore<T extends FilterFields<T, keyof T>> = {
  filter: Filter<T>
  set: (filter: Filter<T>) => void
  clear: () => void
}

export const useFilterStoreImpl = create<FilterStore<Filter<unknown>>>((set) => ({
  filter: {},
  set: (filter) => set({ filter }),
  clear: () => set({ filter: {} })
}))

export const useFilterStore = <T extends FilterFields<T, keyof T>, K extends keyof FilterStore<T>>(
  selector: (state: FilterStore<T>) => FilterStore<T>[K]
) => useFilterStoreImpl(selector)

export const setFilterStore = useFilterStoreImpl.setState as <T extends FilterFields<T, keyof T>>(
  partial: (state: Partial<FilterStore<Partial<T>>>) => Partial<FilterStore<Partial<T>>>,
  replace?: boolean
) => void
