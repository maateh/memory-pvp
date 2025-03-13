/* Filter types */
export type Filter<T> = Partial<{ [key in keyof T]: T[key] }>

/* Sort types */
export type SortKey = "asc" | "desc"
export type Sort<T> = Partial<{ [key in keyof T]: SortKey }>
