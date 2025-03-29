"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/util"
import { cva, VariantProps } from "class-variance-authority"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = (
  {
    ref,
    className,
    inset,
    children,
    ...props
  }
) => (<DropdownMenuPrimitive.SubTrigger
  ref={ref}
  className={cn(
    "flex gap-x-2 cursor-default select-none items-center rounded-lg px-2 py-1.5 text-sm outline-hidden group focus:bg-muted/85 focus:text-muted-foreground data-[state=open]:bg-muted/85 data-[state=open]:text-muted-foreground",
    inset && "pl-8",
    className
  )}
  {...props}
>
  {children}
  <ChevronRight className="ml-auto h-4 w-4" />
</DropdownMenuPrimitive.SubTrigger>)
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = (
  {
    ref,
    className,
    ...props
  }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent> & {
    ref: React.RefObject<React.ElementRef<typeof DropdownMenuPrimitive.SubContent>>;
  }
) => (<DropdownMenuPrimitive.SubContent
  ref={ref}
  className={cn(
    "z-50 min-w-[8rem] space-y-1 overflow-hidden rounded-xl border border-border/45 bg-popover mx-1.5 p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
    className
  )}
  {...props}
/>)
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = (
  {
    ref,
    className,
    sideOffset = 4,
    ...props
  }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> & {
    ref: React.RefObject<React.ElementRef<typeof DropdownMenuPrimitive.Content>>;
  }
) => (<DropdownMenuPrimitive.Portal>
  <DropdownMenuPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 min-w-[8rem] space-y-1 overflow-hidden rounded-xl border border-border/45 bg-popover p-1 m-3 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
</DropdownMenuPrimitive.Portal>)
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const itemVariants = cva(
  "group relative flex cursor-pointer select-none items-center gap-x-2 rounded-lg px-2 py-1.5 text-sm outline-hidden transition-colors focus:font-medium data-disabled:pointer-events-none data-disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "focus:bg-accent focus:text-accent-foreground",
        secondary: "text-secondary focus:bg-secondary focus:text-secondary-foreground",
        accent: "text-accent focus:bg-accent focus:text-accent-foreground",
        muted: "text-muted-foreground focus:bg-muted",
        destructive: "text-destructive focus:bg-destructive focus:text-destructive-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

type DropdownMenuItemProps = {
  inset?: boolean
} & React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
  & VariantProps<typeof itemVariants>

const DropdownMenuItem = (
  {
    ref,
    className,
    variant,
    inset,
    ...props
  }: DropdownMenuItemProps & {
    ref: React.RefObject<React.ElementRef<typeof DropdownMenuPrimitive.Item>>;
  }
) => (<DropdownMenuPrimitive.Item
  ref={ref}
  className={cn(itemVariants({ className, variant }), { "pl-8": inset })}
  {...props}
/>)
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = (
  {
    ref,
    className,
    variant,
    children,
    checked,
    ...props
  }
) => (<DropdownMenuPrimitive.CheckboxItem
  ref={ref}
  className={cn(itemVariants({ className, variant }), "py-1.5 pl-8 pr-2")}
  checked={checked}
  {...props}
>
  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
    <DropdownMenuPrimitive.ItemIndicator>
      <Check className="h-4 w-4" />
    </DropdownMenuPrimitive.ItemIndicator>
  </span>
  {children}
</DropdownMenuPrimitive.CheckboxItem>)
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = (
  {
    ref,
    className,
    variant,
    children,
    ...props
  }
) => (<DropdownMenuPrimitive.RadioItem
  ref={ref}
  className={cn(itemVariants({ className, variant }))}
  {...props}
>
  {children}
  <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
    <DropdownMenuPrimitive.ItemIndicator>
      <Circle className="h-2.5 w-2.5 fill-current" />
    </DropdownMenuPrimitive.ItemIndicator>
  </span>
</DropdownMenuPrimitive.RadioItem>)
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = (
  {
    ref,
    className,
    inset,
    ...props
  }
) => (<DropdownMenuPrimitive.Label
  ref={ref}
  className={cn(
    "px-2 py-1.5 text-sm font-semibold",
    inset && "pl-8",
    className
  )}
  {...props}
/>)
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = (
  {
    ref,
    className,
    ...props
  }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator> & {
    ref: React.RefObject<React.ElementRef<typeof DropdownMenuPrimitive.Separator>>;
  }
) => (<DropdownMenuPrimitive.Separator
  ref={ref}
  className={cn("-mx-1 my-1 h-px bg-muted", className)}
  {...props}
/>)
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
