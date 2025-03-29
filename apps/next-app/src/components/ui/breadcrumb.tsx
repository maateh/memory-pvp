import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/util"

const Breadcrumb = ({ ...props }: React.ComponentProps<"nav">) => (
  <nav
    aria-label="breadcrumb"
    data-slot="breadcrumb"
    {...props}
  />
)

const BreadcrumbList = ({ className, ...props }: React.ComponentProps<"ol">) => (
  <ol className={cn("flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5", className)}
    data-slot="breadcrumb-list"
    {...props}
  />
)

const BreadcrumbItem = ({ className, ...props }: React.ComponentProps<"li">) => (
  <li className={cn("inline-flex items-center gap-1.5", className)}
    data-slot="breadcrumb-item"
    {...props}
  />
)

const BreadcrumbLink = ({
  asChild,
  className,
  ...props
}: React.ComponentProps<"a"> & { asChild?: boolean }) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp className={cn("transition-colors hover:text-foreground", className)}
      data-slot="breadcrumb-link"
      {...props}
    />
  )
}

const BreadcrumbPage = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span className={cn("font-normal text-foreground", className)}
    role="link"
    aria-disabled="true"
    aria-current="page"
    data-slot="breadcrumb-page"
    {...props}
  />
)

const BreadcrumbSeparator = ({ children, className, ...props }: React.ComponentProps<"li">) => (
  <li className={cn("[&>svg]:size-3.5", className)}
    role="presentation"
    aria-hidden="true"
    data-slot="breadcrumb-separator"
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
)

const BreadcrumbEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span className={cn("flex h-9 w-9 items-center justify-center", className)}
    role="presentation"
    aria-hidden="true"
    data-slot="breadcrumb-ellipsis"
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
)

const BreadcrumbItemGroup = ({ className, ...props }: React.ComponentProps<"li">) => (
  <BreadcrumbItem className={cn("flex gap-x-1", className)}
    data-slot="breadcrumb-item-group"
    {...props}
  />
)

const BreadcrumbButton = ({
  selected = false,
  className,
  size = "sm",
  ...props
}: React.ComponentProps<typeof Button> & { selected: boolean }) => (
  <Button className={cn("h-fit py-1 px-2.5 text-xs font-normal rounded-full", {
    "bg-secondary/40 hover:bg-secondary/50": selected
  }, className)}
    size={size}
    data-slot="breadcrumb-button"
    {...props}
  />
)

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  BreadcrumbItemGroup,
  BreadcrumbButton
}
