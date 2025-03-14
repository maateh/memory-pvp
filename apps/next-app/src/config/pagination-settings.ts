// types
import type { PaginationParams } from "@repo/schema/search"

/** Maximum item limit of pagination queries */
export const MAX_PAGINATION_LIMIT = 20 as const

/** Default limit value of pagination queries (if not specified) */
export const DEFAULT_PAGINATION_LIMIT = 10 as const

/** Default page value of pagination queries (if not specified) */
export const DEFAULT_PAGINATION_PAGE = 1 as const

/** Fallback pagination params object, if params not specified */
export const FALLBACK_PAGINATION_PARAMS = {
  limit: 10,
  page: 1
} as const satisfies PaginationParams

export function fixedPaginationParams(
  params: PaginationParams | undefined
): Required<PaginationParams> {
  const { limit, page } = params || FALLBACK_PAGINATION_PARAMS

  const currentLimit = limit || DEFAULT_PAGINATION_LIMIT

  return {
    limit: currentLimit > MAX_PAGINATION_LIMIT ? MAX_PAGINATION_LIMIT : currentLimit,
    page: page || DEFAULT_PAGINATION_PAGE
  }
}
