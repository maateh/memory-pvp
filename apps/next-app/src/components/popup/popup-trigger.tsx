"use client"

// shadcn
import { DrawerTrigger } from "@/components/ui/drawer"
import { DialogTrigger } from "@/components/ui/dialog"

// hooks
import { useIsMobile } from "@/hooks/use-is-mobile"

type PopupTriggerProps = {
  renderer: PopupRenderer
} & React.ComponentProps<typeof DrawerTrigger> & React.ComponentProps<typeof DialogTrigger>

const PopupTrigger = ({ renderer, ...props }: PopupTriggerProps) => {
  const isMobile = useIsMobile()

  if (renderer === 'router') return null
  
  if (isMobile) return <DrawerTrigger {...props} />
  return <DialogTrigger {...props} />
}

export default PopupTrigger
