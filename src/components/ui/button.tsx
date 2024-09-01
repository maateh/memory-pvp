import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipContentProps, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-border bg-inherit hover:bg-accent/50 dark:hover:bg-accent/80 hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent/25 dark:hover:bg-accent/15",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

interface ButtonTooltipProps extends ButtonProps {
  tooltip: React.ReactNode
  tooltipProps?: Omit<TooltipContentProps, 'children'>
}

const ButtonTooltip = React.forwardRef<HTMLButtonElement, ButtonTooltipProps>(
  ({ tooltip, tooltipProps, ...props }, ref) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button ref={ref} {...props} />
        </TooltipTrigger>
        <TooltipContent {...tooltipProps}>
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
)
ButtonTooltip.displayName = "ButtonTooltip"

export { Button, ButtonTooltip, buttonVariants }
