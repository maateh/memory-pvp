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

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, "className" | "variant" | "size" | "disabled">
  & React.ComponentProps<typeof Link>

const PaginationLink = ({
  isActive = false,
  className,
  variant = "ghost",
  size = "icon",
  disabled,
  ...props
}: PaginationLinkProps) => (
  <Button
    className={cn("size-10 text-muted-foreground font-normal rounded-xl", {
      "text-foreground/90 font-medium border border-border/15": isActive
    }, className)}
    variant={isActive ? "default" : variant}
    size={size}
    disabled={disabled}
    asChild
  >
    <Link className={cn({ "cursor-not-allowed pointer-events-none opacity-50": disabled })}
      aria-current={isActive ? "page" : undefined}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : undefined}
      scroll={false}
      {...props}
    />
  </Button>
)
PaginationLink.displayName = "PaginationLink"

const PaginationFirst = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink className={cn("md:w-fit md:px-4 gap-x-2 border border-border/10 aria-disabled:hidden", className)}
    aria-label="Go to first page"
    {...props}
  >
    <ChevronsLeft className="size-4 shrink-0" />
    <span className="max-md:sr-only">First</span>
  </PaginationLink>
)
PaginationFirst.displayName = "PaginationFirst"

const PaginationPrevious = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink className={cn("w-fit px-4 gap-x-2 border border-border/10 aria-disabled:hidden", className)}
    aria-label="Go to previous page"
    {...props}
  >
    <ChevronLeft className="size-4 shrink-0" />
    <span>Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink className={cn("w-fit px-4 gap-x-2 border border-border/10 aria-disabled:hidden", className)}
    aria-label="Go to next page"
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="size-4 shrink-0" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationLast = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink className={cn("md:w-fit md:px-4 gap-x-2 border border-border/10 aria-disabled:hidden", className)}
    aria-label="Go to last page"
    {...props}
  >
    <span className="max-md:sr-only">Last</span>
    <ChevronsRight className="size-4 shrink-0" />
  </PaginationLink>
)
PaginationLast.displayName = "PaginationLast"

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex size-10 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="size-4 shrink-0 text-muted-foreground/65" />
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
