"use client"

// types
import type { VariantProps } from "class-variance-authority"

// utils
import { cva } from "class-variance-authority"
import { cn } from "@/lib/util"

// shadcn
import { DrawerFooter } from "@/components/ui/drawer"
import { DialogFooter } from "@/components/ui/dialog"

// hooks
import { useIsMobile } from "@/hooks/use-is-mobile"

const footerVariants = cva("w-full mx-auto pt-4 px-4", {
  variants: {
    variant: {
      default: "flex flex-col gap-y-8 sm:flex-col sm:justify-center",
      action: "flex flex-col-reverse gap-x-3 gap-y-2 sm:flex-row sm:justify-end"
    },
    size: {
      default: "max-w-xl",
      sm: "max-sm:max-w-md"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
})

type PopupFooterProps = React.ComponentProps<"div"> & VariantProps<typeof footerVariants>

const PopupFooter = ({ variant, size, className, ...props }: PopupFooterProps) => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <DrawerFooter className={cn(footerVariants({ variant, size, className }))}
        {...props}
      />
    )
  }

  return (
    <DialogFooter className={cn(footerVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export default PopupFooter
