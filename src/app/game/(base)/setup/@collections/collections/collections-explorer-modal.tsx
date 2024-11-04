// shadcn
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

// components
import { CollectionExplorer } from "@/components/collection"
import { CollectionFilter, CollectionSort } from "@/components/collection/filter"
import { WidgetModal } from "@/components/widgets"

type CollectionsExplorerModalProps = {
  collections: ClientCardCollection[]
}

const CollectionsExplorerModal = ({ collections }: CollectionsExplorerModalProps) => {
  return (
    <WidgetModal
      widgetKey="_"
      title="Browse collections"
      description="Browse the following card collections and choose the one you would like to play with."

    >
      <div className="space-y-0.5">
        <div className="flex items-center gap-x-2">
          <Separator className="w-1.5 h-5 bg-accent rounded-full" />

          <h3 className="mt-1 text-base font-heading font-normal sm:text-lg">
            Filter collections by
          </h3>
        </div>

        <div className="mt-1 flex items-center gap-x-2 sm:gap-x-3.5">
          <CollectionSort />
          <CollectionFilter />
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

export default CollectionsExplorerModal
