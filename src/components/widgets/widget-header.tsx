// types
import type { WidgetProps } from "@/components/widgets/types"

// constants
import { widgetIconMap } from "@/components/widgets/constants"

// utils
import { cn } from "@/lib/utils"

// shadcn
import { CardTitle } from "@/components/ui/card"
import { DialogTitle } from "@/components/ui/dialog"

type WidgetHeaderProps = {
  type: 'dialog' | 'card'
} & Pick<WidgetProps, 'widgetKey' | 'title' | 'iconProps'>

const WidgetHeader = ({ widgetKey, title, type, iconProps }: WidgetHeaderProps) => {
  const Icon = widgetIconMap[widgetKey]
  const Title = type === 'card' ? CardTitle : DialogTitle

  return (
    <div className="flex-1 flex gap-x-4">
      {Icon && (
        <Icon {...iconProps}
          className={cn("size-6 sm:size-7 flex-none", iconProps?.className)}
        />
      )}

      <Title className="text-2xl sm:text-3xl font-heading heading-decorator">
        {title}
      </Title>
    </div>
  )
}

export default WidgetHeader
