import type { SortKey } from "@repo/schema/search"

/* Filter types */
export type FilterService = "store" | "params" | "mixed"

export type FilterPattern = Record<string, unknown>

export type Filter<T extends FilterPattern> = Partial<{
  [K in keyof T]: T[K]
}>

export type FilterOptions<T extends FilterPattern> = Required<{
  [K in keyof T]: Required<T>[K][]
}>

/* Sort types */
export type SortPattern = Record<string, SortKey>

export type Sort<T extends SortPattern> = Partial<{
  [K in keyof T]: SortKey
}>

export type SortOption<T extends SortPattern, K = keyof T> = {
  sortValueKey: K
  label: string
}

export type SortOptions<T extends SortPattern> = {
  [K in keyof T]: SortOption<T, K>
}
