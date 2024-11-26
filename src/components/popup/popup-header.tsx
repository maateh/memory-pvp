"use client"

// types
import type { VariantProps } from "class-variance-authority"

// utils
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

// shadcn
import { DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// hooks
import { useIsMobile } from "@/hooks/use-is-mobile"

const drawerTitleVariants = cva("mt-2 font-heading", {
  variants: {
    size: {
      default: "text-2xl",
      sm: "text-xl"
    }
  },
  defaultVariants: {
    size: "default"
  }
})

const dialogTitleVariants = cva("font-heading", {
  variants: {
    size: {
      default: "text-2xl sm:text-3xl",
      sm: "text-xl"
    }
  },
  defaultVariants: {
    size: "default"
  }
})

type PopupHeaderProps = {
  title: string
  description: string
  titleProps?: React.ComponentProps<"h2">
  descriptionProps?: React.ComponentProps<"p">
} & React.ComponentProps<"div">
  & VariantProps<typeof drawerTitleVariants & typeof dialogTitleVariants>

const PopupHeader = ({
  title,
  description,
  titleProps,
  descriptionProps,
  size,
  className,
  ...props
}: PopupHeaderProps) => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <DrawerHeader className={cn("gap-y-0", className)} {...props}>
        <DrawerTitle {...titleProps}
          className={cn(drawerTitleVariants({ size, className: titleProps?.className }))}
        >
          {title}
        </DrawerTitle>

        <DrawerDescription {...descriptionProps}
          className={cn("text-muted-foreground text-sm font-light", descriptionProps?.className)}
        >
          {description}
        </DrawerDescription>
      </DrawerHeader>
    )
  }

  return (
    <DialogHeader className={cn("gap-y-0", className)} {...props}>
      <DialogTitle {...titleProps}
        className={cn(dialogTitleVariants({ size, className: titleProps?.className }))}
      >
        {title}
      </DialogTitle>

      <DialogDescription {...descriptionProps}
        className={cn("text-muted-foreground text-sm font-light", descriptionProps?.className)}
      >
        {description}
      </DialogDescription>
    </DialogHeader>
  )
}

export default PopupHeader
