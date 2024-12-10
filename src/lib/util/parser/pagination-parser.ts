// config
import { getFixedPaginationParams } from "@/config/pagination-settings"

/**
 * Calculates pagination parameters based on the provided input.
 * 
 * - Computes the `skip` and `take` values for database queries.
 * - Ensures the input pagination parameters are fixed and valid.
 * 
 * @param {PaginationParams} params - The pagination parameters containing `page` and `limit`.
 * @returns {{ skip: number; take: number }} - An object with the calculated `skip` and `take` values.
 */
export function paginate(params: PaginationParams): { skip: number; take: number } {
  const { page, limit } = getFixedPaginationParams(params)

  return {
    skip: (page - 1) * limit,
    take: limit
  }
}

/**
 * Wraps paginated data with metadata for easier consumption.
 * 
 * - Calculates total pages and checks for the existence of the next page.
 * - Ensures the pagination parameters are valid and fixed.
 * 
 * @param {T[]} data - The array of data items for the current page.
 * @param {number} total - The total number of items available.
 * @param {PaginationParams} params - The pagination parameters containing `page` and `limit`.
 * @returns {Pagination<T>} - An object containing paginated data and metadata (total pages, current page, etc.).
 */
export function paginationWrapper<T>(data: T[], total: number, params: PaginationParams): Pagination<T> {
  const { page, limit } = getFixedPaginationParams(params)

  const totalPage = Math.ceil(total / limit)
  const hasNextPage = page < totalPage

  return { data, totalPage, hasNextPage, page, limit }
}
/**
 * Generates an array of page numbers with ellipsis for pagination display.
 * Note: Logic generated by *v0*.
 * 
 * - Ensures first and last pages are always included.
 * - Displays pages within a delta range of the current page.
 * - Adds ellipsis where gaps exist between displayed page numbers.
 * 
 * @param {PaginationWithoutData} param - An object containing the current page and total number of pages.
 * @returns {(string | number)[]} - An array representing page numbers and ellipsis (`...`) for gaps.
 */
export function getPageNumbers({ page, totalPage }: PaginationWithoutData): (string | number)[] {
  /* Number of pages to show on either side of the current page */
  const delta = 1

  /* Will store the initial range of page numbers */
  const range: number[] = []

  /* Will store the final range with ellipsis */
  const rangeWithDots: (string | number)[] = []

  /* Used to keep track of the last number added to rangeWithDots */
  let l: number | undefined

  /* Generates the initial range of page numbers */
  for (let i = 1; i <= totalPage; i++) {
    /* Always include first page, last page, and pages within delta of current page */
    if (
      i === 1 || 
      i === totalPage || 
      (i >= page - delta && i <= page + delta)
    ) {
      range.push(i)
    }
  }

  /* Adds ellipsis and page numbers to the final range */
  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        /* If there's a gap of one number, add that number */
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        /* If there's a gap of more than one number, add ellipsis */
        rangeWithDots.push('...')
      }
    }

    /* Add the current number to the final range */
    rangeWithDots.push(i)

    /* Update l to the current number */
    l = i
  }

  return rangeWithDots
}
