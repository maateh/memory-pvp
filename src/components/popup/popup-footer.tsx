"use client"

// utils
import { cn } from "@/lib/utils"

// shadcn
import { DrawerFooter } from "@/components/ui/drawer"
import { DialogFooter } from "@/components/ui/dialog"

// hooks
import { useIsMobile } from "@/hooks/use-is-mobile"

const PopupFooter = ({ className, ...props }: React.ComponentProps<"div">) => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <DrawerFooter className={cn("w-full max-w-xl mx-auto px-4 gap-y-8", className)}
        {...props}
      />
    )
  }

  return (
    <DialogFooter className={cn("w-full max-w-xl mx-auto px-4 flex flex-col gap-y-8 sm:flex-col sm:justify-center", className)}
      {...props}
    />
  )
}

export default PopupFooter
