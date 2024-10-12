"use client"

import { useRouter } from "next/navigation"

// utils
import { cn } from "@/lib/utils"

// types
import type { WidgetInfo } from "@/components/widgets/types"

// shadcn
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

// components
import { WidgetHeader } from "@/components/widgets"

type WidgetModalProps = {
  isOpen: boolean
} & WidgetInfo
  & React.PropsWithChildren

const WidgetModal = ({ title, description, icon, isOpen, children }: WidgetModalProps) => {
  const router = useRouter()

  return (
    <Dialog open={isOpen} onOpenChange={() => router.back()}>
      <DialogContent>
        <DialogHeader>
          <WidgetHeader icon={icon} title={title} type="dialog" />

          <DialogDescription className={cn("font-extralight text-base", { 'sr-only': !description })}>
            {description || `${title} widget`}
          </DialogDescription>
        </DialogHeader>

        <Separator className="w-1/3 mx-auto mt-1 mb-4 bg-border/25" />

        {children}
      </DialogContent>
    </Dialog>
  )
}

export default WidgetModal
