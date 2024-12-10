// types
import type { FilterParamValue } from "@/hooks/use-filter-params"

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

type ParseFilterParamsReturn<T extends { [key in keyof T]: FilterParamValue }> = {
  filter: Filter<T>
  sort: Sort<T>
  pagination: PaginationParams
}

/**
 * Parses URL search parameters into separate filter and sort objects based on specified keys.
 * 
 * - Collects keys from `URLSearchParams` and differentiates them as either filter or sort parameters.
 * - Sort parameters are indicated by "asc" or "desc" keys, where each value is categorized as ascending or descending.
 * - All other keys are treated as filter parameters, with each key-value pair added to the `filter` object.
 * - Returns an object with `filter` and `sort` properties, representing parsed filtering and sorting instructions.
 * 
 * @template T - The shape of the parameter object, where each key's value must be of type `string`, `number`, or `boolean`.
 * @param {URLSearchParams} params - The search parameters to parse.
 * @returns {ParseFilterParamsReturn<T>} - An object with `filter` and `sort` properties for filtered and sorted results.
 */
export function parseFilterParams<T extends { [key in keyof T]: FilterParamValue }>(
  params: URLSearchParams
): ParseFilterParamsReturn<T> {
  const keys = Array.from(params.keys())

  /* Filter parser */
  const filter = keys.filter((key) => key !== 'asc' && key !== 'desc' && key !== 'page' && key !== 'limit')
    .reduce((filter, key) => {
      let value: string | boolean | null = params.get(key)

      /* Parses `true` and `false` string values to boolean */
      if (value === 'true' || value === 'false') {
        value = value === 'true'
      }

      return {
        ...filter,
        [key]: value
      }
    }, {} as Filter<T>)
  
  /* Sort parser */
  const sortAscValue = params.get('asc')
  const sortDescValue = params.get('desc')

  params.delete('asc')
  params.delete('desc')

  let sort: Sort<T> = {}

  if (sortAscValue) {
    sort = { [sortAscValue]: 'asc' } as Sort<T>
  } else if (sortDescValue) {
    sort = { [sortDescValue]: 'desc' } as Sort<T>
  }

  /* Pagination parser */
  const pageValue = params.get('page')
  const limitValue = params.get('limit')

  const pagination: PaginationParams = {
    page: pageValue ? parseInt(pageValue) : undefined,
    limit: limitValue ? parseInt(limitValue) : undefined
  }

  return { filter, sort, pagination }
}

/**
 * Converts a `sort` object into a single-field `orderBy` object for Prisma queries.
 *
 * This function returns the first defined sorting field in `{ field: direction }` format,
 * or `undefined` if no sorting fields are provided.
 * 
 * @param sort - An object with sorting options, where each key is a field name 
 *               and the value is "asc" or "desc".
 * @returns An object with one sorting field for Prisma's `orderBy`, or `undefined`.
 */
export function parseSortToOrderBy<T extends { [K in keyof T]: SortKey }>(
  sort: Partial<T>
): Partial<T> | undefined {
  const entries = Object.entries(sort)

  if (entries.length === 0) return undefined

  const [valueKey, sortKey] = entries[0]
  return { [valueKey]: sortKey } as Partial<T>
}
