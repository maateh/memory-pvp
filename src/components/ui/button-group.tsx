"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { CheckCircle } from "lucide-react"

import { cn } from "@/lib/util"
import { buttonVariants } from "./button"
import { VariantProps } from "class-variance-authority"

const ButtonGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("flex gap-5", className)}
      {...props}
      ref={ref}
    />
  );
});
ButtonGroup.displayName = RadioGroupPrimitive.Root.displayName;

const ButtonGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
    & VariantProps<typeof buttonVariants>
>(({ className, variant, size, children, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "relative data-[state=checked]:bg-accent/70",
        buttonVariants({ className, variant, size })
      )}
      {...props}
    >
      <RadioGroupPrimitive.RadioGroupIndicator className="absolute top-1 right-1">
        <CheckCircle className="size-4 shrink-0 text-primary" />
      </RadioGroupPrimitive.RadioGroupIndicator>

      {children}
    </RadioGroupPrimitive.Item>
  );
});
ButtonGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { ButtonGroup, ButtonGroupItem };
