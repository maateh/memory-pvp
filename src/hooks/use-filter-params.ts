import { useCallback, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

type FilterValue = string | number | boolean

type Filter<T extends { [key in keyof T]: FilterValue }> = Partial<T>

type SortKey = "asc" | "desc"

type Sort<T> = Partial<{ [key in keyof T]: SortKey }>

type UseFilterParamsReturn<T extends { [key in keyof T]: string | number | boolean }> = {
  filter: Filter<T>
  sort: Sort<T>
  addFilterParam: (key: keyof T, value: string) => void
  toggleSortParam: (value: keyof T) => void
  removeFilterParam: (key: keyof T | SortKey) => void
  clearFilterParams: () => void
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
   * Creates a query string by adding or updating a parameter key and value in the existing URL search parameters.
   * 
   * @param {keyof T | SortKey} key - The key of the parameter to set.
   * @param {FilterValue | keyof T} value - The value to set for the parameter.
   * @returns {string} - The updated query string.
   */
  const createQueryString = useCallback((key: keyof T | SortKey, value: FilterValue | keyof T) => {
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

  /** 
   * Parses the current URL parameters into a `filter` object.
   * 
   * @returns {Filter<T>} - The parsed filter parameters.
   */
  const filter: Filter<T> = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString())
    const keys = Array.from(params.keys())

    return keys.reduce((filter, key) => ({
      ...filter,
      [key]: params.get(key)
    }), {} as Filter<T>)
  }, [searchParams])

  /** 
   * Parses the current URL parameters into a `sort` object.
   * 
   * @returns {Sort<T>} - The parsed sort parameters.
   */
  const sort: Sort<T> = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString())

    const sort = params.getAll('asc').reduce((sort, value) => ({
      ...sort,
      [value]: 'asc'
    }), {} as Sort<T>)

    return params.getAll('desc').reduce((sort, value) => ({
      ...sort,
      [value]: 'desc'
    }), sort)
  }, [searchParams])

  /** 
   * Adds or updates a filter parameter in the URL search parameters.
   * 
   * @param {keyof T} key - The key of the filter parameter to set.
   * @param {string} value - The value to set for the filter parameter.
   */
  const addFilterParam = (key: keyof T, value: string) => {
    const query = createQueryString(key, value)
    router.replace(pathname + '?' + query)
  }

  /** 
   * Removes a filter or sort parameter from the URL search parameters.
   * 
   * @param {keyof T | SortKey} key - The key of the parameter to remove.
   */
  const removeFilterParam = (key: keyof T | SortKey) => {
    const query = removeQueryString(key)
    router.replace(pathname + '?' + query)
  }

  /** 
   * Clears all filter and sort parameters from the URL, resetting to the base path.
   */
  const clearFilterParams = () => {
    searchParams.keys().map((key) => removeQueryString(key as keyof T | SortKey))
    router.replace(pathname)
  }

  /** 
   * Toggles a sort parameter in the URL. Cycles through sorting by `desc`, `asc`, or removes sorting for a given key.
   * 
   * - If no current sort is applied to the given key, it adds `desc`.
   * - If the current sort for the key is `desc`, it toggles to `asc`.
   * - If the current sort for the key is `asc`, it removes the sorting for that key.
   * 
   * @param {keyof T} value - The key of the sort parameter to toggle.
   */
  const toggleSortParam = (value: keyof T) => {
    const params = new URLSearchParams(searchParams.toString())
    const currentAscParams = params.getAll('asc')
    const currentDescParams = params.getAll('desc')

    let currentSortKey: SortKey | undefined

    if (currentAscParams.includes(value.toString())) {
      currentSortKey = 'asc'
    } else if (currentDescParams.includes(value.toString())) {
      currentSortKey = 'desc'
    }

    if (!currentSortKey) {
      params.append('desc', value.toString())
    }
    
    if (currentSortKey === 'desc') {
      params.append('asc', value.toString())

      params.delete('desc')
      currentDescParams.filter((param) => param !== value.toString())
        .map((value) => params.append('desc', value))
    }

    if (currentSortKey === 'asc') {
      params.delete('asc')
      currentAscParams.filter((param) => param !== value.toString())
        .map((value) => params.append('asc', value))
    }

    const query = params.toString()
    router.replace(pathname + '?' + query)
  }

  return {
    filter, sort,
    addFilterParam, removeFilterParam, clearFilterParams,
    toggleSortParam
  }
}
