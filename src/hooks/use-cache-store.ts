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

export const useCacheStore = useCacheStoreImpl as {
  <T>(): CacheStore<T>;
  <T, S>(selector: (s: CacheStore<T>) => S): S
}
