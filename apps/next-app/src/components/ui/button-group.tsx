"use client"

import type { LucideProps } from "lucide-react"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { CheckCircle } from "lucide-react"

import { cn } from "@/lib/util"
import { buttonVariants } from "./button"
import { VariantProps } from "class-variance-authority"

const ButtonGroup = (
  {
    ref,
    className,
    ...props
  }: React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> & {
    ref: React.RefObject<React.ElementRef<typeof RadioGroupPrimitive.Root>>;
  }
) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("flex gap-5", className)}
      {...props}
      ref={ref}
    />
  );
};
ButtonGroup.displayName = RadioGroupPrimitive.Root.displayName;

type ButtonGroupItemProps = {
  indicatorProps?: React.ComponentProps<typeof RadioGroupPrimitive.RadioGroupIndicator>
  iconProps?: LucideProps
} & React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
  & VariantProps<typeof buttonVariants>

const ButtonGroupItem = (
  {
    ref,
    className,
    variant = "ghost",
    size,
    children,
    indicatorProps,
    iconProps,
    ...props
  }: ButtonGroupItemProps & {
    ref: React.RefObject<React.ElementRef<typeof RadioGroupPrimitive.Item>>;
  }
) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "flex items-center justify-center gap-x-2.5 gap-y-2 relative border border-border/35 data-[state=checked]:bg-accent/45",
        buttonVariants({ className, variant, size })
      )}
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
  );
};
ButtonGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { ButtonGroup, ButtonGroupItem };
