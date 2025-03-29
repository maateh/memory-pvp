import type { LucideProps } from "lucide-react"
import type { VariantProps } from "class-variance-authority"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { CheckCircle } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/util"

const ButtonGroup = ({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) => (
  <RadioGroupPrimitive.Root className={cn("flex gap-5", className)}
    data-slot="button-group"
    {...props}
  />
)

const ButtonGroupItem = ({
  className,
  variant = "ghost",
  size,
  children,
  indicatorProps,
  iconProps,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item> & VariantProps<typeof buttonVariants> & {
  indicatorProps?: React.ComponentProps<typeof RadioGroupPrimitive.RadioGroupIndicator>
  iconProps?: LucideProps
}) => (
  <RadioGroupPrimitive.Item className={cn("flex items-center justify-center gap-x-2.5 gap-y-2 relative border border-border/35 data-[state=checked]:bg-accent/45", buttonVariants({ className, variant, size }))}
    data-slot="button-group-item"
    {...props}
  >
    <RadioGroupPrimitive.RadioGroupIndicator {...indicatorProps}
      className={cn("absolute top-1.5 right-1.5", indicatorProps?.className)}
    >
      <CheckCircle {...iconProps}
        className={cn("size-3.5 shrink-0 text-foreground/75", iconProps?.className)}
        strokeWidth={iconProps?.strokeWidth || 2.5}
      />
    </RadioGroupPrimitive.RadioGroupIndicator>

    {children}
  </RadioGroupPrimitive.Item>
)

export { ButtonGroup, ButtonGroupItem };
