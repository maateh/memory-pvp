import { useCallback, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

// types
import type { SortKey, PaginationParams } from "@repo/schema/search"
import type { Filter, FilterPattern, Sort, SortPattern } from "@/lib/types/search"

// utils
import { parseSearchParams } from "@/lib/util/parser"

export type FilterParamValue = string | number | boolean
export type PaginationAction = "reset" | "reset"

type UseFilterParamsReturn<F extends FilterPattern, S extends SortPattern> = {
  filter: Filter<F>
  sort: Sort<S>
  pagination: PaginationParams
  addFilterParam: (key: keyof (F & S), value: string, pagination?: PaginationAction) => void
  toggleFilterParam: (key: keyof F, value: string, pagination?: PaginationAction) => void
  removeFilterParam: (key: keyof (F & S), pagination?: PaginationAction) => void
  clearFilterParams: (pagination?: PaginationAction) => void
  toggleSortParam: (value: keyof S) => void
}

// TODO: rename to `useSearch`

/**
 * Custom hook to manage filtering and sorting query parameters for URL-based state.
 * 
 * - Parses `filter` and `sort` states from the current URL's query parameters.
 * - Provides utility functions to add, toggle, and remove filter and sort parameters directly in the URL.
 * 
 * @template T - Generic type for the filterable data structure, with fields as `string`, `number`, or `boolean`.
 * 
 * @returns {UseFilterParamsReturn<T>} - An object containing the parsed `filter`, `sort`, and functions to manipulate query parameters.
 */
export function useFilterParams<F extends FilterPattern, S extends SortPattern>(
  options: Parameters<typeof parseSearchParams<F, S>>["1"]
): UseFilterParamsReturn<F, S> {
  const searchParams = useSearchParams()

  const router = useRouter()
  const pathname = usePathname()

  /** 
   * Parses the current URL parameters and separates into a `filter`, `sort` and `pagination` object.
   * 
   * @returns {Object} - An object within the parsed `filter`, `sort` and `pagination` parameters.
   */
  const { filter, sort, pagination } = useMemo(() => {
    return parseSearchParams<F, S>(searchParams.entries(), options)
  }, [searchParams, options])

  /** 
   * Creates a query string by adding or updating a parameter key and value in the existing URL search parameters.
   * 
   * @param {keyof (F & S)} key - The key of the parameter to set.
   * @param {FilterParamValue | keyof T} value - The value to set for the parameter.
   * @returns {string} - The updated query string.
   */
  const createQueryString = useCallback((key: keyof (F & S), value: FilterParamValue | keyof S, pagination: PaginationAction) => {
    const params = new URLSearchParams(searchParams.toString())

    if (typeof key === "string") {
      params.set(key, value.toString())
    }

    if (pagination === "reset") {
      params.delete("page")
    }

    return params.toString()
  }, [searchParams])

  /** 
   * Removes a specified query parameter key from the URL search parameters.
   * 
   * @param {keyof (F & S)} key - The key of the parameter to remove.
   * @returns {string} - The updated query string.
   */
  const removeQueryString = useCallback((key: keyof (F & S), pagination: PaginationAction) => {
    const params = new URLSearchParams(searchParams.toString())

    if (typeof key === "string") {
      params.delete(key)
    }

    if (pagination === "reset") {
      params.delete("page")
    }

    return params.toString()
  }, [searchParams])

  /** 
   * Adds or updates a filter parameter in the URL search parameters.
   * 
   * @param {keyof T} key - The key of the filter parameter to set.
   * @param {string} value - The value to set for the filter parameter.
   */
  const addFilterParam = useCallback((key: keyof (F & S), value: string, pagination: PaginationAction = "reset") => {
    const query = createQueryString(key, value, pagination)
    router.replace(pathname + '?' + query, { scroll: false })
  }, [router, pathname, createQueryString])

  /** 
   * Adds or removes a filter parameter in the URL search parameters based on its current value.
   * 
   * - If the specified key's current filter value matches the provided `value`, removes the parameter.
   * - Otherwise, sets the parameter with the given `key` and `value`.
   * 
   * @param {keyof T} key - The filter parameter key to toggle.
   * @param {string} value - The value to set or remove for the filter parameter.
   */
  const toggleFilterParam = useCallback((key: keyof F, value: string, pagination: PaginationAction = "reset") => {
    const query = filter[key] === value
      ? removeQueryString(key, pagination)
      : createQueryString(key, value, pagination)

    router.replace(pathname + '?' + query, { scroll: false })
  }, [router, pathname, filter, createQueryString, removeQueryString])

  /** 
   * Removes a filter or sort parameter from the URL search parameters.
   * 
   * @param {keyof (F & S)} key - The key of the parameter to remove.
   */
  const removeFilterParam = useCallback((key: keyof (F & S), pagination: PaginationAction = "reset") => {
    const query = removeQueryString(key, pagination)
    router.replace(pathname + '?' + query, { scroll: false })
  }, [router, pathname, removeQueryString])

  /** 
   * Clears all filter and sort parameters from the URL, resetting to the base path.
   */
  const clearFilterParams = useCallback((pagination: PaginationAction = "reset") => {
    searchParams.keys().map((key) => removeQueryString(key as keyof (F & S), pagination))
    router.replace(pathname, { scroll: false })
  }, [router, pathname, searchParams, removeQueryString])

  /** 
   * Toggles a sort parameter in the URL. Cycles through sorting by `desc`, `asc`, or removes sorting for a given key.
   * 
   * - If no current sort is applied to the given key, it adds `desc`.
   * - If the current sort for the key is `desc`, it toggles to `asc`.
   * - If the current sort for the key is `asc`, it removes the sorting for that key.
   * 
   * @param {keyof T} value - The key of the sort parameter to toggle.
   */
  const toggleSortParam = useCallback((value: keyof S) => {
    const params = new URLSearchParams(searchParams.toString())
    const sortAscParam = params.get('asc')
    const sortDescParam = params.get('desc')

    params.delete('desc')
    params.delete('asc')

    let currentSortKey: SortKey | undefined

    if (sortAscParam === value.toString()) {
      currentSortKey = 'asc'
    } else if (sortDescParam === value.toString()) {
      currentSortKey = 'desc'
    }

    if (!currentSortKey) {
      params.set('desc', value.toString())
    }

    if (currentSortKey === 'desc') {
      params.set('asc', value.toString())
    }

    const query = params.toString()
    router.replace(pathname + '?' + query, { scroll: false })
  }, [router, pathname, searchParams])

  return {
    filter,
    sort,
    pagination,
    addFilterParam,
    toggleFilterParam,
    removeFilterParam,
    clearFilterParams,
    toggleSortParam
  }
}
