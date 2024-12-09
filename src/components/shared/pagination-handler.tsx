// utils
import { cn } from "@/lib/util"

// shadcn
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination"

type PaginationHandlerProps = {
  pathname: string
  searchParams?: Record<string, string>
  pagination: PaginationWithoutData
  showIndicator?: boolean
  indicatorProps?: React.ComponentProps<typeof Badge>
} & React.ComponentProps<typeof Pagination>

const PaginationHandler = ({
  pathname,
  searchParams = {},
  pagination,
  showIndicator = false,
  indicatorProps,
  ...props
}: PaginationHandlerProps) => {
  return (
    <Pagination {...props}>
      <PaginationContent>
        <PaginationItem>
          <PaginationFirst
            href={{
              pathname,
              query: { ...searchParams, page: 1 }
            }}
            disabled={pagination.page <= 1}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationPrevious
            href={{
              pathname,
              query: { ...searchParams, page: pagination.page - 1 }
            }}
            disabled={pagination.page <= 1}
          />
        </PaginationItem>

        {showIndicator && (
          <PaginationItem className="px-1">
            <Badge {...indicatorProps}
              className={cn("px-2.5 py-1 font-semibold rounded-lg", indicatorProps?.className)}
              variant={indicatorProps?.variant || "muted"}
            >
              Page {pagination.page}/{pagination.totalPage}
            </Badge>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            href={{
              pathname,
              query: { ...searchParams, page: pagination.page + 1 }
            }}
            disabled={!pagination.hasNextPage}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLast
            href={{
              pathname,
              query: { ...searchParams, page: pagination.totalPage }
            }}
            disabled={!pagination.hasNextPage}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default PaginationHandler
