"use client"

// utils
import { cn } from "@/lib/utils"

// shadcn
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

// hooks
import { useWidget } from "@/hooks/use-widget"

type WidgetModalProps = {
  title: string
  description?: string
  icon?: React.ReactNode
  isOpen: boolean
} & React.PropsWithChildren

const WidgetModal = ({
  title,
  description,
  icon,
  isOpen,
  children
}: WidgetModalProps) => {
  const { closeModal } = useWidget()

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <div className="flex-1 flex gap-x-4">
            {icon && (
              <div className="size-6 sm:size-7">
                {icon}
              </div>
            )}

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
