import { create } from "zustand"

/** Store types */
type CacheStore<T = any> = {
  cache: T | null
  set: (cache: T) => void
  clear: () => void
}

/** Generic cache store implementation */
const useCacheStoreImpl = create<CacheStore>((set) => ({
  cache: null,
  set: (cache) => set({ cache }),
  clear: () => set({ cache: null })
}))

/**
 * Zustand store for caching a single generic data and access it everywhere.
 * 
 * - `data`: Stores cached data (initially `null`).
 * - `set(data)`: Updates the cache with new data.
 * - `clear()`: Clears the cached data by setting it to `null`.
 */
export const useCacheStore = <T, K extends keyof CacheStore<T>>(
  selector: (state: CacheStore<T>) => CacheStore<T>[K]
) => useCacheStoreImpl(selector)
