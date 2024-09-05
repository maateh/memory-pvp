"use client"

// utils
import { cn } from "@/lib/utils"

// components
import { type WidgetInfo } from "@/components/widgets"

// shadcn
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

// hooks
import { useWidgetModal } from "@/hooks/use-widget-modal"

type WidgetModalProps = {
  isOpen: boolean
} & WidgetInfo
  & React.PropsWithChildren

const WidgetModal = ({ title, description, Icon, isOpen, children }: WidgetModalProps) => {
  const closeModal = useWidgetModal((state) => state.closeModal)

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <div className="flex-1 flex gap-x-4">
            {Icon && <Icon className="size-6 sm:size-7" />}

            <DialogTitle className="text-2xl sm:text-3xl font-heading heading-decorator">
              {title}
            </DialogTitle>
          </div>

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
