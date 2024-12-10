// config
import { getFixedPaginationParams } from "@/config/pagination-settings"

/**
 * TODO: write doc
 * 
 * @param param
 * @returns 
 */
export function paginate(params: PaginationParams): { skip: number; take: number } {
  const { page, limit } = getFixedPaginationParams(params)

  return {
    skip: (page - 1) * limit,
    take: limit
  }
}

/**
 * TODO: write doc
 * 
 * @param param
 * @returns 
 */
export function paginationWrapper<T>(data: T[], total: number, params: PaginationParams): Pagination<T> {
  const { page, limit } = getFixedPaginationParams(params)

  const totalPage = Math.ceil(total / limit)
  const hasNextPage = page < totalPage

  return { data, totalPage, hasNextPage, page, limit }
}

/**
 * TODO: write doc
 * Note: Pagination handler logic generated with v0.
 * 
 * @param
 * @returns 
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
