import type { SortKey } from "@repo/schema/search"

/* Filter types */
export type FilterService = "store" | "params" | "mixed"

export type FilterOptions<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K][]
}

/* Sort types */
export type SortOption<T extends Record<string, SortKey>, K = keyof T> = {
  sortValueKey: K
  label: string
}

export type SortOptions<T extends Record<string, SortKey>> = {
  [K in keyof T]: SortOption<T, K>
}
