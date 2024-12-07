import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import type { LucideIcon, LucideProps } from "lucide-react"

import { cn } from "@/lib/util"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs transition-colors shadow-sm focus:shadow-md dark:shadow-md dark:focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground/90",
        outline: "border-border/30 text-foreground/90 hover:border-border/40 hover:bg-transparent/5 dark:hover:bg-transparent/15 hover:text-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:text-secondary-foreground/90",
        accent: "border-transparent bg-accent text-accent-foreground hover:bg-accent/90",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:text-destructive-foreground/90",
        muted: "border-transparent bg-muted text-muted-foreground hover:bg-muted/90 hover:text-muted-foreground/95"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export interface BadgeWithIconProps extends BadgeProps {
  Icon: LucideIcon
  iconProps?: LucideProps
}

function BadgeWithIcon({ Icon, iconProps, className, children, ...props }: BadgeWithIconProps) {
  return (
    <Badge className={cn("gap-x-2", className)} {...props}>
      <Icon {...iconProps}
        className={cn("size-4 shrink-0", iconProps?.className)}
        strokeWidth={iconProps?.strokeWidth || 1.75}
      />

      {children}
    </Badge>
  )
}

export { Badge, BadgeWithIcon, badgeVariants }
