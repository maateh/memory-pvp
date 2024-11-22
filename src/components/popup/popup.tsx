"use client"

import { useRouter } from "next/navigation"

// utils
import { cn } from "@/lib/utils"

// shadcn
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { Dialog, DialogContent } from "@/components/ui/dialog"

// hooks
import { useIsMobile } from "@/hooks/use-is-mobile"

type PopupProps = {
  renderer: PopupRenderer
  
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: ((open: boolean) => void)

  className?: string
  children: React.ReactNode
}

const Popup = ({ renderer, className, children, ...props }: PopupProps) => {
  const router = useRouter()
  const isMobile = useIsMobile()

  const open = renderer === 'router' || props?.open
  const onOpenChange = renderer === 'router' ? router.back : props?.onOpenChange

  if (isMobile) {
    return (
      <Drawer {...props}
        open={open}
        onOpenChange={onOpenChange}
      >
        <DrawerContent className={cn("max-h-[80vh] border-border/25", className)}>
          {children}
        </DrawerContent>
      </Drawer>
    )
  }
  
  return (
    <Dialog {...props}
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className={cn("xl:max-w-screen-lg", className)}>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export default Popup
