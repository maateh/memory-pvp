"use client"

// utils
import { cn } from "@/lib/utils"

// shadcn
import { DrawerContent } from "@/components/ui/drawer"
import { DialogContent } from "@/components/ui/dialog"

// hooks
import { useIsMobile } from "@/hooks/use-is-mobile"

const PopupContent = ({ className, ...props }: React.ComponentProps<typeof DrawerContent> & React.ComponentProps<typeof DialogContent>) => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <DrawerContent className={cn("max-h-[80vh] border-border/25", className)}
        {...props}
      />
    )
  }
  return (
    <DialogContent className={cn("xl:max-w-screen-lg", className)}
      {...props}
    />
  )
}

export default PopupContent
