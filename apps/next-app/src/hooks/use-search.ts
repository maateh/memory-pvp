import { useCallback, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

// types
import type { SortKey, PaginationParams } from "@repo/schema/search"
import type { Filter, FilterPattern, Sort, SortPattern } from "@/lib/types/search"

// utils
import { parseSearchParams } from "@/lib/util/parser/search-parser"

type PaginationAction = "keep" | "reset"

type UseSearchReturn<F extends FilterPattern, S extends SortPattern> = {
  filter: Filter<F>
  sort: Sort<S>
  pagination: PaginationParams
  addSearchParam: (key: keyof (F & S & PaginationParams), value: string, pagination?: PaginationAction) => void
  removeSearchParam: (key: keyof (F & S & PaginationParams), pagination?: PaginationAction) => void
  clearSearchParams: (pagination?: PaginationAction) => void
  toggleFilterParam: (key: keyof F, value: string, pagination?: PaginationAction) => void
  toggleSortParam: (value: keyof S, pagination?: PaginationAction) => void
}

/**
 * Custom hook to manage filtering, sorting and pagination search parameters for URL-based state.
 * 
 * - Parses `filter`, `sort` and `pagination` states from the current URL's query parameters.
 * - Provides utility functions to add, toggle, and remove search parameters directly in the URL.
 * 
 * @template F Generic type for the filterable data structure.
 * @template S Generic type for the sortable data structure.
 * 
 * @returns {UseSearchReturn<F, S>} An object containing the parsed `filter`, `sort` and `pagination` params and helper functions to manipulate query parameters.
 */
export function useSearch<F extends FilterPattern, S extends SortPattern>(
  options: Parameters<typeof parseSearchParams<F, S>>["1"]
): UseSearchReturn<F, S> {
  const searchParams = useSearchParams()

  const router = useRouter()
  const pathname = usePathname()

  /** 
   * Parses the current URL parameters and separates into a `filter`, `sort` and `pagination` object.
   * 
   * @returns {Object} An object within the parsed `filter`, `sort` and `pagination` parameters.
   */
  const { filter, sort, pagination } = useMemo(() => {
    return parseSearchParams<F, S>(searchParams.entries(), options)
  }, [searchParams, options])

  /** 
   * Creates a query string by adding or updating a parameter key and value in the existing URL search parameters.
   * 
   * @param {keyof (F & S & PaginationParams)} key The key of the parameter to set.
   * @param {string} value The value to set for the parameter.
   * @returns {string} The updated query string.
   */
  const createQueryString = useCallback((
    key: keyof (F & S & PaginationParams),
    value: string,
    pagination: PaginationAction
  ) => {
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
   * @param {keyof (F & S)} key The key of the parameter to remove.
   * @returns {string} The updated query string.
   */
  const removeQueryString = useCallback((
    key: keyof (F & S & PaginationParams),
    pagination: PaginationAction
  ) => {
    const params = new URLSearchParams(searchParams.toString())

    if (typeof key === "string") {
      params.delete(key)
    }

    if (pagination === "reset") {
      params.delete("page")
    }

    return params.toString()
  }, [searchParams])

  return {
    filter,
    sort,
    pagination,

    /** 
     * Adds or updates a search parameter in the URL.
     * 
     * @param {keyof (F & S & PaginationParams)} key The key of the search parameter to set.
     * @param {string} value The value to set for the search parameter.
     * @param {PaginationAction} [pagination="reset"] Pagination action to `keep` or `reset` the current page.
     */
    addSearchParam(
      key: keyof (F & S & PaginationParams),
      value: string,
      pagination: PaginationAction = "reset"
    ) {
      const query = createQueryString(key, value, pagination)
      router.replace(`${pathname}?${query}`, { scroll: false })
    },

    /** 
     * Removes a search parameter from the URL.
     * 
     * @param {keyof (F & S & PaginationParams)} key The key of the search parameter to set.
     * @param {PaginationAction} [pagination="reset"] Pagination action to `keep` or `reset` the current page.
     */
    removeSearchParam(
      key: keyof (F & S & PaginationParams), 
      pagination: PaginationAction = "reset"
    ) {
      const query = removeQueryString(key, pagination)
      router.replace(`${pathname}?${query}`, { scroll: false })
    },

    /** 
     * Clears all search parameters from the URL, resetting to the base path.
     * 
     * @param {PaginationAction} [pagination="reset"] Pagination action to `keep` or `reset` the current page.
     */
    clearSearchParams(pagination: PaginationAction = "reset") {
      searchParams.keys().map((key) => removeQueryString(key as keyof (F & S), pagination))
      router.replace(pathname, { scroll: false })
    },

    /** 
     * Adds or removes a filter parameter in the URL.
     * 
     * - If the specified key's current filter value matches the provided `value`, removes the parameter.
     * - Otherwise, sets the parameter with the given `key` and `value`.
     * 
     * @param {keyof F} key The filter parameter key to toggle.
     * @param {string} value The value to set or remove for the filter parameter.
     * @param {PaginationAction} [pagination="reset"] Pagination action to `keep` or `reset` the current page.
     */
    toggleFilterParam(
      key: keyof F,
      value: string,
      pagination: PaginationAction = "reset"
    ) {
      const query = filter[key] === value
        ? removeQueryString(key, pagination)
        : createQueryString(key, value, pagination)

      router.replace(`${pathname}?${query}`, { scroll: false })
    },

    /** 
     * Toggles a sort parameter in the URL.
     * 
     * - If no current sort is applied to the given key, it adds `desc`.
     * - If the current sort for the key is `desc`, it toggles to `asc`.
     * - If the current sort for the key is `asc`, it removes the sorting for that key.
     * 
     * @param {keyof S} value The key of the sort (value) parameter to toggle.
     * @param {PaginationAction} [pagination="reset"] Pagination action to `keep` or `reset` the current page.
     */
    toggleSortParam(
      value: keyof S,
      pagination: PaginationAction = "keep"
    ) {
      const params = new URLSearchParams(searchParams.toString())
      const sortAscParam = params.get("asc")
      const sortDescParam = params.get("desc")
  
      params.delete("desc")
      params.delete("asc")
      if (pagination === "reset") params.delete("page")
  
      let currentSortKey: SortKey | undefined
  
      if (sortAscParam === value.toString()) {
        currentSortKey = "asc"
      } else if (sortDescParam === value.toString()) {
        currentSortKey = "desc"
      }
  
      if (!currentSortKey) {
        params.set("desc", value.toString())
      }
  
      if (currentSortKey === "desc") {
        params.set("asc", value.toString())
      }
  
      const query = params.toString()
      router.replace(`${pathname}?${query}`, { scroll: false })
    }
  }
}
