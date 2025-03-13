// types
import type { PaginationParams } from "@repo/schema/search"

/** Maximum item limit of pagination queries */
export const MAX_PAGINATION_LIMIT = 20

/** Default limit value of pagination queries (if not specified) */
export const DEFAULT_PAGINATION_LIMIT = 10

/** Default page value of pagination queries (if not specified) */
export const DEFAULT_PAGINATION_PAGE = 1

export function getFixedPaginationParams({ limit, page }: PaginationParams): Required<PaginationParams> {
  const currentLimit = limit || DEFAULT_PAGINATION_LIMIT

  return {
    limit: currentLimit > MAX_PAGINATION_LIMIT ? MAX_PAGINATION_LIMIT : currentLimit,
    page: page || DEFAULT_PAGINATION_PAGE
  }
}
