"use client"

import { useRouter } from "next/navigation"

// shadcn
import { Drawer } from "@/components/ui/drawer"
import { Dialog } from "@/components/ui/dialog"

// hooks
import { useIsMobile } from "@/hooks/use-is-mobile"

type PopupProps = {
  renderer: PopupRenderer
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: ((open: boolean) => void)
  children: React.ReactNode
}

const Popup = ({ renderer, ...props }: PopupProps) => {
  const router = useRouter()
  const isMobile = useIsMobile()

  const open = renderer === 'router' || props?.open
  const onOpenChange = renderer === 'router' ? router.back : props?.onOpenChange

  if (isMobile) {
    return (
      <Drawer {...props}
        open={open}
        onOpenChange={onOpenChange}
      />
    )
  }
  
  return (
    <Dialog {...props}
      open={open}
      onOpenChange={onOpenChange}
    />
  )
}

export default Popup
