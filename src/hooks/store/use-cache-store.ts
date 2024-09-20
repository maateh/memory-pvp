import { create } from "zustand"

export type CacheStore<T> = {
  data: T | null
  set: (data: T) => void
  clear: () => void
}

const useCacheStoreImpl = create<CacheStore<unknown>>((set) => ({
  data: null,
  set: (data) => set({ data }),
  clear: () => set({ data: null })
}))

/**
 * Zustand store for caching generic data and access it everywhere.
 * 
 * - `data`: Stores cached data (initially `null`).
 * - `set(data)`: Updates the cache with new data.
 * - `clear()`: Clears the cached data by setting it to `null`.
 */
export const useCacheStore = useCacheStoreImpl as {
  <T>(): CacheStore<T>;
  <T, S>(selector: (s: CacheStore<T>) => S): S
}
