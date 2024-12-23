"use client"

import Link from "next/link"

import { forwardRef } from "react"

// types
import type { LucideProps } from "lucide-react"

// utils
import { cn } from "@/lib/util"

// icons
import { ChevronsUpDown } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

type WidgetQuickAccessProps = {
  href?: string
  iconProps?: LucideProps
} & React.ComponentProps<typeof Button>

const WidgetQuickAccess = forwardRef<HTMLButtonElement, WidgetQuickAccessProps>(({
  href,
  iconProps,
  className,
  variant = "ghost",
  size = "icon",
  children,
  asChild,
  ...props
}, ref) => {
  const icon = (
    <ChevronsUpDown {...iconProps}
      className={cn("size-3 sm:size-3.5", iconProps?.className)}
    />
  )

  return (
    <Button className={cn("p-1.5 border border-border/10", className)}
      tooltip="Quick access"
      variant={variant}
      size={size}
      asChild={!!href || asChild}
      ref={ref}
      {...props}
    >
      {!href ? icon : (
        <Link href={href} scroll={false}>
          {icon}
        </Link>
      )}
    </Button>
  )
})
WidgetQuickAccess.displayName = "WidgetQuickAccess"

export default WidgetQuickAccess
