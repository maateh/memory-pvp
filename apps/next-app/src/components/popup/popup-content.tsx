"use client"

// types
import type { VariantProps } from "class-variance-authority"

// utils
import { cva } from "class-variance-authority"
import { cn } from "@/lib/util"

// shadcn
import { DrawerContent } from "@/components/ui/drawer"
import { DialogContent } from "@/components/ui/dialog"

// hooks
import { useIsMobile } from "@/hooks/use-is-mobile"

const drawerVariants = cva("border-border/25", {
  variants: {
    size: {
      default: "max-h-[80vh]",
      sm: ""
    }
  },
  defaultVariants: {
    size: "default"
  }
})

const dialogVariants = cva("border-border dark:border-border/40", {
  variants: {
    size: {
      default: "xl:max-w-screen-lg",
      sm: "px-4 pb-4 lg:max-w-screen-sm"
    }
  },
  defaultVariants: {
    size: "default"
  }
})

type PopupContentProps = React.ComponentProps<
  typeof DrawerContent & typeof DialogContent
> & VariantProps<typeof drawerVariants & typeof dialogVariants>

const PopupContent = ({ size, className, ...props }: PopupContentProps) => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <DrawerContent className={cn(drawerVariants({ className, size }))}
        {...props}
      />
    )
  }

  return (
    <DialogContent className={cn(dialogVariants({ className, size }))}
      {...props}
    />
  )
}

export default PopupContent
