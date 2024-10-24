// constants
import { collectionUploadWidgetInfo, widgetIconMap } from "@/components/widgets/constants"

// shadcn
import { Button } from "@/components/ui/button"

// components
import { WidgetEmptyCardLink } from "@/components/widgets"

const CollectionsUploadWidgetPage = () => {
  const { widgetKey } = collectionUploadWidgetInfo
  const Icon = widgetIconMap[widgetKey]

  return (
    <WidgetEmptyCardLink className="flex-1 w-full max-w-lg"
      href="/collections/upload"
      {...collectionUploadWidgetInfo}
    >
      <Button className="mb-2 p-2"
        variant="ghost"
        size="icon"
      >
        <Icon className="size-6 mx-auto text-accent sm:size-8" />
      </Button>

      <p className="font-heading font-medium dark:font-light">
        Create your custom <span className="text-accent font-semibold dark:font-medium">card collection</span>
      </p>
    </WidgetEmptyCardLink>
  )
}

export default CollectionsUploadWidgetPage
