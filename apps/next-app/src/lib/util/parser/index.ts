// types
import type { z } from "zod"
import type { SortKey, PaginationParams } from "@repo/schema/search"
import type { Filter, FilterPattern, Sort, SortPattern } from "@/lib/types/search"

// schemas
import { paginationParams, sortKey } from "@repo/schema/search"

/**
 * Selectively picks specified fields from an object.
 * 
 * - Takes an object and an array of keys, returning a new object with only the specified fields.
 * - If a key doesn't exist in the object, it is ignored.
 * 
 * @param {T} obj - The object to pick fields from.
 * @param {U[]} keys - An array of keys to extract from the object.
 * 
 * @returns {Pick<T, U>} - A new object containing only the specified fields.
 */
export function pickFields<T extends object, U extends keyof T>(obj: T, keys: U[]): Pick<T, U> {
  const result = {} as Pick<T, U>
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key]
    }
  })
  return result
}

type ParseSearchParamsOptions<F extends FilterPattern, S extends SortPattern> = {
  filterSchema?: z.ZodSchema<F>
  sortSchema?: z.ZodSchema<S>
  parsePagination?: boolean
}

type ParseSearchParamsReturn<F extends FilterPattern, S extends SortPattern> = {
  filter: Filter<F>
  sort: Sort<S>
  pagination: PaginationParams
}

/**
 * TODO: write doc
 * 
 * @param searchEntries 
 * @param options 
 * @returns 
 */
export function parseSearchParams<F extends FilterPattern, S extends SortPattern>(
  searchEntries: URLSearchParamsIterator<[string, string]>,
  options: ParseSearchParamsOptions<F, S>
): ParseSearchParamsReturn<F, S> {
  const { filterSchema, sortSchema, parsePagination = false } = options

  const params = Object.fromEntries(searchEntries)
  let filter: Filter<F> = {}
  let sort: Sort<S> = {}
  let pagination: PaginationParams = {}

  if (filterSchema) {
    const { data, success } = filterSchema.safeParse(params)
    if (success) filter = data
  }

  if (sortSchema) {
    const swappedParams = Object.fromEntries(
      searchEntries.filter(([key]) => sortKey.safeParse(key).success)
        .map((entry) => entry.reverse())
    )
    
    const { data, success } = sortSchema.safeParse(swappedParams)
    if (success) sort = data
  }

  if (parsePagination) {
    const { data, success } = paginationParams.safeParse(params)
    if (success) pagination = data
  }

  return { filter, sort, pagination }
}

/**
 * Validates and converts a `sort` object into a single-field `orderBy` object for Prisma queries.
 *
 * This function validates the `sort` input using the provided Zod schema. If validation passes,
 * it converts the `sort` object into a single `{ field: direction }` format for Prisma queries,
 * using the first defined sorting field. If validation fails or the `sort` object is empty,
 * it returns the fallback value.
 *
 * @template T - A record type where keys are field names and values are "asc" or "desc".
 * @param sortInput - The input object to validate and parse into an `orderBy` object.
 * @param sortSchema - The Zod schema to validate the `sortInput` object.
 * @param fallback - A fallback object to return if validation fails or no sorting fields are provided.
 * @returns {Partial<T> | undefined} An object with one sorting field for Prisma's `orderBy`, or the fallback if validation fails or is empty.
 */
export function parseSortToOrderBy<T extends Record<string, SortKey>>(
  sortInput: T,
  sortSchema: z.ZodSchema<T>,
  fallback?: Partial<T>
): Partial<T> | undefined {
  const { success, data: sort } = sortSchema.safeParse(sortInput)
  if (!success) return fallback

  const entries = Object.entries(sort)
  if (entries.length === 0) return fallback

  const [valueKey, sortKey] = entries[0]
  return { [valueKey]: sortKey } as Partial<T>
}
