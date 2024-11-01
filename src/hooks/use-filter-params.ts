import { useCallback, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

// types
import type { Filter, Sort, SortKey } from "./store/use-filter-store"

// utils
import { parseFilterParams } from "@/lib/utils"

export type FilterParamValue = string | number | boolean

type UseFilterParamsReturn<T extends { [key in keyof T]: string | number | boolean }> = {
  filter: Filter<T>
  sort: Sort<T>
  addFilterParam: (key: keyof T, value: string) => void
  toggleFilterParam: (key: keyof T, value: string) => void
  removeFilterParam: (key: keyof T | SortKey) => void
  clearFilterParams: () => void
  toggleSortParam: (value: keyof T) => void
}

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
export function useFilterParams<T extends { [key in keyof T]: string | number | boolean }>(): UseFilterParamsReturn<T> {
  const searchParams = useSearchParams()

  const router = useRouter()
  const pathname = usePathname()

  /** 
   * Parses the current URL parameters and separates into a `filter` and `sort` object.
   * 
   * @returns {Object} - An object within the parsed `filter` and `sort` parameters.
   */
  const { filter, sort } = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString())
    return parseFilterParams<T>(params)
  }, [searchParams])

  /** 
   * Creates a query string by adding or updating a parameter key and value in the existing URL search parameters.
   * 
   * @param {keyof T | SortKey} key - The key of the parameter to set.
   * @param {FilterParamValue | keyof T} value - The value to set for the parameter.
   * @returns {string} - The updated query string.
   */
  const createQueryString = useCallback((key: keyof T | SortKey, value: FilterParamValue | keyof T) => {
    const params = new URLSearchParams(searchParams.toString())

    if (typeof key === 'string') {
      params.set(key, value.toString())
    }

    return params.toString()
  }, [searchParams])

  /** 
   * Removes a specified query parameter key from the URL search parameters.
   * 
   * @param {keyof T | SortKey} key - The key of the parameter to remove.
   * @returns {string} - The updated query string.
   */
  const removeQueryString = useCallback((key: keyof T | SortKey) => {
    const params = new URLSearchParams(searchParams.toString())

    if (typeof key === 'string') {
      params.delete(key)
    }

    return params.toString()
  }, [searchParams])

  return {
    filter, sort,

    /** 
     * Adds or updates a filter parameter in the URL search parameters.
     * 
     * @param {keyof T} key - The key of the filter parameter to set.
     * @param {string} value - The value to set for the filter parameter.
     */
    addFilterParam(key: keyof T, value: string) {
      const query = createQueryString(key, value)
      router.replace(pathname + '?' + query)
    },

    /** 
     * Adds or removes a filter parameter in the URL search parameters based on its current value.
     * 
     * - If the specified key's current filter value matches the provided `value`, removes the parameter.
     * - Otherwise, sets the parameter with the given `key` and `value`.
     * 
     * @param {keyof T} key - The filter parameter key to toggle.
     * @param {string} value - The value to set or remove for the filter parameter.
     */
    toggleFilterParam(key: keyof T, value: string) {
      const query = filter[key] === value
        ? removeQueryString(key)
        : createQueryString(key, value)

      router.replace(pathname + '?' + query)
    },

    /** 
     * Removes a filter or sort parameter from the URL search parameters.
     * 
     * @param {keyof T | SortKey} key - The key of the parameter to remove.
     */
    removeFilterParam(key: keyof T | SortKey) {
      const query = removeQueryString(key)
      router.replace(pathname + '?' + query)
    },

    /** 
     * Clears all filter and sort parameters from the URL, resetting to the base path.
     */
    clearFilterParams() {
      searchParams.keys().map((key) => removeQueryString(key as keyof T | SortKey))
      router.replace(pathname)
    },

    /** 
     * Toggles a sort parameter in the URL. Cycles through sorting by `desc`, `asc`, or removes sorting for a given key.
     * 
     * - If no current sort is applied to the given key, it adds `desc`.
     * - If the current sort for the key is `desc`, it toggles to `asc`.
     * - If the current sort for the key is `asc`, it removes the sorting for that key.
     * 
     * @param {keyof T} value - The key of the sort parameter to toggle.
     */
    toggleSortParam(value: keyof T) {
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
      router.replace(pathname + '?' + query)
    }
  }
}
