import type { PaginationParams, SortKey } from "@repo/schema/search"

/* Filter types */
export type FilterService = "store" | "params" | "mixed"

export type FilterPattern = Record<string, unknown>

export type Filter<F extends FilterPattern> = Partial<{
  [K in keyof F]: F[K]
}>

export type FilterOptions<F extends FilterPattern> = Required<{
  [K in keyof F]: Required<F>[K][]
}>

/* Sort types */
export type SortSchemaKey = "collection" | "player" | "session"

export type SortPattern = Record<string, SortKey>

export type Sort<S extends SortPattern> = Partial<{
  [K in keyof S]: SortKey
}>

export type SortOption<S extends SortPattern, K = keyof S> = {
  sortValueKey: K
  label: string
}

export type SortOptions<S extends SortPattern> = {
  [K in keyof S]: SortOption<S, K>
}

/* Merged search types */
export type SearchPattern = FilterPattern & SortPattern & PaginationParams

export type Search<F extends FilterPattern, S extends SortPattern> = {
  filter: Filter<F>
  sort: Sort<S>
  pagination: PaginationParams
}
