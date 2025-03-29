"use client"

import type { VariantProps } from "class-variance-authority"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { cva } from "class-variance-authority"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/util"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = ({
  className,
  inset = false,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean
}) => (
  <DropdownMenuPrimitive.SubTrigger className={cn("flex gap-x-2 cursor-default select-none items-center rounded-lg px-2 py-1.5 text-sm outline-hidden group focus:bg-muted/85 focus:text-muted-foreground data-[state=open]:bg-muted/85 data-[state=open]:text-muted-foreground", {
    "pl-8": inset
  }, className)}
    data-slot="dropdown-menu-sub-trigger"
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
)

const DropdownMenuSubContent = ({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) => (
  <DropdownMenuPrimitive.SubContent className={cn("z-50 min-w-[8rem] space-y-1 overflow-hidden rounded-xl border border-border/45 bg-popover mx-1.5 p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className)}
    data-slot="dropdown-menu-sub-content"
    {...props}
  />
)

const DropdownMenuContent = ({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content className={cn("z-50 min-w-[8rem] space-y-1 overflow-hidden rounded-xl border border-border/45 bg-popover p-1 m-3 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className)}
      data-slot="dropdown-menu-content"
      sideOffset={sideOffset}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
)

const dropdownMenuItemVariants = cva(
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

const DropdownMenuItem = ({
  className,
  variant,
  inset = false,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & VariantProps<typeof dropdownMenuItemVariants> & {
  inset?: boolean
}) => (
  <DropdownMenuPrimitive.Item className={cn(dropdownMenuItemVariants({ className, variant }), { "pl-8": inset })}
    data-slot="dropdown-menu-item"
    {...props}
  />
)

const DropdownMenuCheckboxItem = ({
  className,
  variant,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem> & VariantProps<typeof dropdownMenuItemVariants>) => (
  <DropdownMenuPrimitive.CheckboxItem className={cn(dropdownMenuItemVariants({ className, variant }), "py-1.5 pl-8 pr-2")}
    checked={checked}
    data-slot="dropdown-menu-checkbox-item"
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
)

const DropdownMenuRadioItem = ({
  className,
  variant,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem> & VariantProps<typeof dropdownMenuItemVariants>) => (
  <DropdownMenuPrimitive.RadioItem className={cn(dropdownMenuItemVariants({ className, variant }))}
    data-slot="dropdown-menu-radio-item"
    {...props}
  >
    {children}
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2.5 w-2.5 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
  </DropdownMenuPrimitive.RadioItem>
)

const DropdownMenuLabel = ({
  className,
  inset = false,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean
}) => (
  <DropdownMenuPrimitive.Label className={cn("px-2 py-1.5 text-sm font-semibold", {
    "pl-8": inset
  }, className)}
    data-slot="dropdown-menu-label"
    {...props}
  />
)

const DropdownMenuSeparator = ({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) => (
  <DropdownMenuPrimitive.Separator className={cn("-mx-1 my-1 h-px bg-muted", className)}
    data-slot="dropdown-menu-separator"
    {...props}
  />
)

const DropdownMenuShortcut = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
    data-slot="dropdown-menu-shortcut"
    {...props}
  />
)

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
  DropdownMenuRadioGroup
}
