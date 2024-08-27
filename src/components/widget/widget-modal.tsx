// utils
import { cn } from "@/lib/utils"

// icons
import { LucideIcon } from "lucide-react"

// shadcn
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

type WidgetModalProps = {
  widgetKey: string
  title: string
  description?: string
  Icon?: LucideIcon
} & React.PropsWithChildren

const WidgetModal = ({ widgetKey, title, description, Icon, children }: WidgetModalProps) => {
  return (
    <Dialog>
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

        <Separator className="w-1/3 mx-auto mt-1 mb-4 bg-border/10" />

        {children}
      </DialogContent>
    </Dialog>
  )
}

export default WidgetModal
