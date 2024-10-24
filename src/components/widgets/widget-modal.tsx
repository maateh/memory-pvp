"use client"

import { useRouter } from "next/navigation"

// types
import type { WidgetProps } from "@/components/widgets/types"

// utils
import { cn } from "@/lib/utils"

// shadcn
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

// components
import { WidgetHeader } from "@/components/widgets"

type WidgetModalProps = {
  children: React.ReactNode
} & WidgetProps & Omit<React.ComponentProps<typeof Dialog>, 'onOpenChange'>

const WidgetModal = ({
  widgetKey, title, description, iconProps,
  open = true,
  children, ...props
}: WidgetModalProps) => {
  const router = useRouter()

  return (
    <Dialog open={open} onOpenChange={() => router.back()} {...props}>
      <DialogContent>
        <DialogHeader>
          <WidgetHeader
            type="dialog"
            widgetKey={widgetKey}
            title={title}
          />

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
