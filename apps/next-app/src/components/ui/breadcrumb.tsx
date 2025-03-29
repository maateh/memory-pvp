import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

import { cn } from "@/lib/util"

const Breadcrumb = (
  {
    ref,
    ...props
  }
) => <nav ref={ref} aria-label="breadcrumb" {...props} />
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbList = (
  {
    ref,
    className,
    ...props
  }: React.ComponentPropsWithoutRef<"ol"> & {
    ref: React.RefObject<HTMLOListElement>;
  }
) => (<ol
  ref={ref}
  className={cn(
    "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
    className
  )}
  {...props}
/>)
BreadcrumbList.displayName = "BreadcrumbList"

const BreadcrumbItem = (
  {
    ref,
    className,
    ...props
  }: React.ComponentPropsWithoutRef<"li"> & {
    ref: React.RefObject<HTMLLIElement>;
  }
) => (<li
  ref={ref}
  className={cn("inline-flex items-center gap-1.5", className)}
  {...props}
/>)
BreadcrumbItem.displayName = "BreadcrumbItem"

const BreadcrumbLink = (
  {
    ref,
    asChild,
    className,
    ...props
  }
) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      ref={ref}
      className={cn("transition-colors hover:text-foreground", className)}
      {...props}
    />
  )
}
BreadcrumbLink.displayName = "BreadcrumbLink"

const BreadcrumbPage = (
  {
    ref,
    className,
    ...props
  }: React.ComponentPropsWithoutRef<"span"> & {
    ref: React.RefObject<HTMLSpanElement>;
  }
) => (<span
  ref={ref}
  role="link"
  aria-disabled="true"
  aria-current="page"
  className={cn("font-normal text-foreground", className)}
  {...props}
/>)
BreadcrumbPage.displayName = "BreadcrumbPage"

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:size-3.5", className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
)
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis"

const BreadcrumbItemGroup = ({
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <BreadcrumbItem className={cn("flex gap-x-1", className)}
    {...props}
  />
)
BreadcrumbItemGroup.displayName = "BreadcrumbItemGroup"

type BreadcrumbButtonProps = {
  selected: boolean
} & React.ComponentProps<typeof Button>

const BreadcrumbButton = ({
  selected = false,
  className,
  size = "sm",
  ...props
}: BreadcrumbButtonProps) => (
  <Button className={cn(
    "h-fit py-1 px-2.5 text-xs font-normal rounded-full",
    { "bg-secondary/40 hover:bg-secondary/50": selected },
    className
  )}
    size={size}
    {...props}
  />
)
BreadcrumbButton.displayName = "BreadcrumbButton"

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
