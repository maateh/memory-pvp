"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "@/lib/util"

const Drawer = ({ shouldScaleBackground = true, ...props }: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    data-slot="drawer"
    {...props}
  />
)

const DrawerTrigger = DrawerPrimitive.Trigger

const DrawerPortal = DrawerPrimitive.Portal

const DrawerClose = DrawerPrimitive.Close

const DrawerOverlay = ({ className, ...props }: React.ComponentProps<typeof DrawerPrimitive.Overlay>) => (
  <DrawerPrimitive.Overlay className={cn("fixed inset-0 z-50 bg-black/80", className)}
    data-slot="drawer-overlay"
    {...props}
  />
)

const DrawerContent = ({ className, children, ...props }: React.ComponentProps<typeof DrawerPrimitive.Content>) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content className={cn("fixed inset-x-0 bottom-0 z-50 mt-24 mx-auto flex h-auto max-w-(--breakpoint-lg) flex-col rounded-t-2xl border bg-background", className)}
      data-slot="drawer-content"
      {...props}
    >
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
)

const DrawerHeader = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div className={cn("grid gap-1.5 p-4 mx-1.5 md:mx-8", className)}
    data-slot="drawer-header"
    {...props}
  />
)

const DrawerFooter = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div className={cn("mt-auto flex flex-col gap-2 p-4", className)}
    data-slot="drawer-footer"
    {...props}
  />
)

const DrawerTitle = ({ className, ...props }: React.ComponentProps<typeof DrawerPrimitive.Title>) => (
  <DrawerPrimitive.Title className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    data-slot="drawer-title"
    {...props}
  />
)

const DrawerDescription = ({ className, ...props }: React.ComponentProps<typeof DrawerPrimitive.Description>) => (
  <DrawerPrimitive.Description className={cn("text-sm text-muted-foreground", className)}
    data-slot="drawer-description"
    {...props}
  />
)

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription
}
