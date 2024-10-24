// constants
import { collectionManageWidgetInfo, widgetIconMap } from "@/components/widgets/constants"

// shadcn
import { Button } from "@/components/ui/button"

// components
import { WidgetEmptyCardLink } from "@/components/widgets"

const CollectionsManageWidgetCard = () => {
  const { widgetKey } = collectionManageWidgetInfo
  const Icon = widgetIconMap[widgetKey]

  return (
    <WidgetEmptyCardLink className="flex-1 w-full max-w-lg bg-secondary/25 dark:bg-secondary/10 hover:bg-secondary/30 dark:hover:bg-secondary/15"
      href="/collections/manage"
      {...collectionManageWidgetInfo}
    >
      <Button className="mb-2 p-2"
        variant="ghost"
        size="icon"
      >
        <Icon className="size-6 mx-auto text-accent sm:size-8" />
      </Button>

      <p className="font-heading font-medium dark:font-light">
        Manage your <span className="text-accent font-semibold dark:font-medium">card collections</span>
      </p>
    </WidgetEmptyCardLink>
  )
}

export default CollectionsManageWidgetCard
