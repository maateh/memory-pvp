// types
import type { z } from "zod"
import type { PaginationParams } from "@repo/schema/search"
import type { Filter, FilterPattern, Search, Sort, SortPattern } from "@/lib/types/search"

// schemas
import { paginationParams, sortKey } from "@repo/schema/search"

type ParseSearchParamsOptions<F extends FilterPattern, S extends SortPattern> = {
  filterSchema?: z.ZodSchema<F>
  sortSchema?: z.ZodSchema<S>
  parsePagination?: boolean
}

/**
 * Parses URL search parameters into filter, sort, and pagination objects.
 * 
 * This function extracts search parameters, validates them using provided schemas, 
 * and structures them into filter, sort, and optional pagination objects.
 * 
 * @template F extends FilterPattern
 * @template S extends SortPattern
 * 
 * @param {URLSearchParamsIterator<[string, string]>} searchEntries URLSearchParams iterator.
 * @param {ParseSearchParamsOptions<F, S>} options Parsing options including filter and sort schemas.
 * @returns {Search<F, S>} Parsed search parameters as filter, sort, and pagination objects.
 */
export function parseSearchParams<F extends FilterPattern, S extends SortPattern>(
  searchEntries: URLSearchParamsIterator<[string, string]>,
  options: ParseSearchParamsOptions<F, S>
): Search<F, S> {
  const { filterSchema, sortSchema, parsePagination = false } = options

  const params = Object.fromEntries(searchEntries)
  let filter: Filter<F> = {}
  let sort: Sort<S> = {}
  let pagination: PaginationParams = {}

  if (filterSchema) {
    const fixedParams = Object.entries(params)
      .reduce((params, [key, value]) => ({
        ...params,
        [key]: value === "true" || value
      }), {} as Filter<F>)

    const { data, success } = filterSchema.safeParse(fixedParams)
    if (success) filter = data
  }

  if (sortSchema) {
    const swappedParams = Object.entries(params)
      .filter(([key]) => sortKey.safeParse(key).success)
      .reduce((params, [key, value]) => ({ ...params, [value]: key }), {} as Sort<S>)
      
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
 * Parses a sorting parameter into a Prisma order-by query.
 * 
 * @template S - The type of the sorting criteria.
 * 
 * @param {S | undefined} sort Sorting criteria.
 * @param {z.ZodSchema<S>} sortSchema Zod schema to validate the sorting input.
 * @param {Sort<S> | undefined} [fallback] Optional fallback sorting value.
 * @returns {Sort<S> | undefined} Parsed sorting object or fallback.
 */
export function parseSortToOrderBy<S extends SortPattern>(
  sort: S | undefined,
  sortSchema: z.ZodSchema<S>,
  fallback?: Sort<S>
): Sort<S> | undefined {
  const { success, data: parsedSort } = sortSchema.safeParse(sort)
  if (!success) return fallback

  const entries = Object.entries(parsedSort)
  if (entries.length === 0) return fallback

  const [valueKey, sortKey] = entries[0]
  return { [valueKey]: sortKey } as Sort<S>
}
