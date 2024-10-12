import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import type { LucideIcon, LucideProps } from "lucide-react"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        outline: "text-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        accent: "border-transparent bg-accent text-accent-foreground hover:bg-accent/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        muted: "border-transparent bg-muted-foreground text-muted hover:bg-muted-foreground/80"
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
        className={cn("size-4", iconProps?.className)}
        strokeWidth={iconProps?.strokeWidth || 1.75}
      />

      {children}
    </Badge>
  )
}

export { Badge, BadgeWithIcon, badgeVariants }
