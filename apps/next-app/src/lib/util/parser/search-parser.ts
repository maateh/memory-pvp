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
 * TODO: write doc
 * 
 * @param searchEntries 
 * @param options 
 * @returns 
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
 * Validates and converts a `sort` object into a single-field `orderBy` object for Prisma queries.
 *
 * This function validates the `sort` input using the provided Zod schema. If validation passes,
 * it converts the `sort` object into a single `{ field: direction }` format for Prisma queries,
 * using the first defined sorting field. If validation fails or the `sort` object is empty,
 * it returns the fallback value.
 *
 * @template S A record type where keys are field names and values are "asc" or "desc".
 * @param {Sort<S> | undefined} sort The input object to validate and parse into an `orderBy` object.
 * @param {z.ZodSchema<S>} sortSchema The Zod schema to validate the `sortInput` object.
 * @param {Sort<S>} fallback A fallback object to return if validation fails or no sorting fields are provided.
 * @returns {Sort<S> | undefined} An object with one sorting field for Prisma's `orderBy`, or the fallback if validation fails or is empty.
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
