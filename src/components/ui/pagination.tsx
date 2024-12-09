import * as React from "react"
import Link from "next/link"

// utils
import { cn } from "@/lib/util"

// icons
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1.5", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ ...props }, ref) => (
  <li ref={ref} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = Pick<
  React.ComponentProps<typeof Button>,
  "className" | "variant" | "size" | "disabled"
> & React.ComponentProps<typeof Link>

const PaginationLink = ({
  className,
  variant = "outline",
  size = "icon",
  disabled,
  ...props
}: PaginationLinkProps) => (
  <Button
    className={cn("p-1.5 rounded-xl", className)}
    variant={variant}
    size={size}
    disabled={disabled}
    asChild
  >
    <Link className={cn({ "cursor-not-allowed pointer-events-none opacity-50": disabled })}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : undefined}
      scroll={false}
      {...props}
    />
  </Button>
)
PaginationLink.displayName = "PaginationLink"

const PaginationFirst = ({ ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to first page" {...props}>
    <ChevronsLeft className="size-4 shrink-0" />
    <span className="sr-only">First</span>
  </PaginationLink>
)
PaginationFirst.displayName = "PaginationFirst"

const PaginationPrevious = ({ ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to previous page" {...props}>
    <ChevronLeft className="size-4 shrink-0" />
    <span className="sr-only">Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({ ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to next page" {...props}>
    <span className="sr-only">Next</span>
    <ChevronRight className="size-4 shrink-0" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationLast = ({ ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to last page" {...props}>
    <span className="sr-only">Last</span>
    <ChevronsRight className="size-4 shrink-0" />
  </PaginationLink>
)
PaginationLast.displayName = "PaginationLast"

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex size-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="size-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationFirst,
  PaginationNext,
  PaginationPrevious,
  PaginationLast
}
