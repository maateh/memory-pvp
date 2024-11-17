"use client"

import { forwardRef } from "react"

// types
import type { LucideProps } from "lucide-react"

// utils
import { cn } from "@/lib/utils"

// icons
import { ChevronsUpDown } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

type WidgetQuickAccessProps = {
  iconProps?: LucideProps
} & React.ComponentProps<typeof Button>

const WidgetQuickAccess = forwardRef<HTMLButtonElement, WidgetQuickAccessProps>(({
  iconProps,
  className,
  variant = "ghost",
  size = "icon",
  children,
  ...props
}, ref) => {
  return (
    <Button className={cn("p-1.5 border border-border/10", className)}
      tooltip="Quick access"
      variant={variant}
      size={size}
      ref={ref}
      {...props}
    >
      <ChevronsUpDown {...iconProps}
        className={cn("size-3 sm:size-3.5", iconProps?.className)}
      />
    </Button>
  )
})
WidgetQuickAccess.displayName = "WidgetQuickAccess"

export default WidgetQuickAccess
