// utils
import { getPageNumbers } from "@/lib/util/parser/pagination-parser"

// shadcn
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination"

type PaginationHandlerProps = {
  pathname: string
  searchParams?: Record<string, string>
  pagination: PaginationWithoutData
} & React.ComponentProps<typeof Pagination>

const PaginationHandler = ({
  pathname,
  searchParams = {},
  pagination,
  ...props
}: PaginationHandlerProps) => {
  const buildHref = (pageNumber: number | string) => {
    const query = new URLSearchParams(searchParams)
    query.set('page', pageNumber.toString())
    return `${pathname}?${query.toString()}`
  }

  return (
    <Pagination {...props}>
      <PaginationContent className="flex-wrap justify-center gap-2">
        <div className="flex items-center gap-x-1.5">
          <PaginationItem>
            <PaginationFirst
              href={buildHref(1)}
              disabled={pagination.page <= 1}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationPrevious
              href={buildHref(pagination.page - 1)}
              disabled={pagination.page <= 1}
            />
          </PaginationItem>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-1.5">
          {getPageNumbers(pagination).map((pageNumber, index) => (
            <PaginationItem key={index}>
              {pageNumber === '...' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href={buildHref(pageNumber)}
                  isActive={pagination.page === pageNumber}
                >
                  {pageNumber}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
        </div>

        <div className="flex items-center gap-x-1.5">
          <PaginationItem>
            <PaginationNext
              href={buildHref(pagination.page + 1)}
              disabled={!pagination.hasNextPage}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLast
              href={buildHref(pagination.totalPage)}
              disabled={!pagination.hasNextPage}
            />
          </PaginationItem>
        </div>
      </PaginationContent>
    </Pagination>
  )
}

export default PaginationHandler
