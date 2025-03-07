/* Filter types */
export type FilterService = "store" | "params" | "mixed"

export type Filter<T> = Partial<{ [key in keyof T]: T[key] }>

export type FilterOptions<T> = {
  [K in keyof T]: T[K][]
}

/* Sort types */
export type SortKey = "asc" | "desc"

export type Sort<T> = Partial<{ [key in keyof T]: SortKey }>

export type SortOption<T> = {
  sortValueKey: keyof T
  label: string
}

export type SortOptions<T> = {
  [K in keyof T]: SortOption<T>
}

/* Pagination types */
export type PaginationParams = Partial<{
  page: number
  limit: number
}>

export type Pagination<T> = Required<PaginationParams> & {
  data: T[]
  totalPage: number
  hasNextPage: boolean
}

export type PaginationWithoutData = Omit<Pagination<unknown>, 'data'>
