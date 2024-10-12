// shadcn
import { CardTitle } from "@/components/ui/card"
import { DialogTitle } from "@/components/ui/dialog"

type WidgetHeaderProps = {
  icon: React.ReactNode
  title: string
  type: 'dialog' | 'card'
}

const WidgetHeader = ({ icon, title, type }: WidgetHeaderProps) => {
  const Title = type === 'card' ? CardTitle : DialogTitle

  return (
    <div className="flex-1 flex gap-x-4">
      {icon && (
        <div className="size-6 sm:size-7 shrink-0">
          {icon}
        </div>
      )}

      <Title className="text-2xl sm:text-3xl font-heading heading-decorator">
        {title}
      </Title>
    </div>
  )
}

export default WidgetHeader
