// shadcn
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

// components
import { CollectionExplorer } from "@/components/collection"
import {
  CollectionNameFilter,
  CollectionSizeFilter,
  CollectionSort,
  CollectionUserToggleFilter
} from "@/components/collection/filter"
import { WidgetModal } from "@/components/widgets"

type CollectionExplorerModalProps = {
  collections: ClientCardCollection[]
}

const CollectionExplorerModal = ({ collections }: CollectionExplorerModalProps) => {
  return (
    <WidgetModal
      widgetKey="_"
      title="Browse collections"
      description="Browse the following card collections and choose the one you would like to play with."
    >
      <div className="max-w-xs space-y-2">
        <CollectionNameFilter />

        <div className="mt-1 flex items-center gap-x-2 sm:gap-x-3.5">
          <CollectionSort />
          <CollectionSizeFilter />
          <CollectionUserToggleFilter includeByDefault />
        </div>
      </div>

      <Separator className="w-11/12 mx-auto bg-border/10" />

      <ScrollArea className="max-h-96 pr-3">
        <CollectionExplorer className="flex flex-col gap-y-5"
          cardProps={{ imageSize: 36 }}
          collections={collections}
        />
      </ScrollArea>
    </WidgetModal>
  )
}

export default CollectionExplorerModal
