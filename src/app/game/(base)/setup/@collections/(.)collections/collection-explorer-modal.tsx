import { Suspense } from "react"

// shadcn
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

// components
import { CollectionExplorer, CollectionExplorerSkeleton } from "@/components/collection"
import {
  CollectionNameFilter,
  CollectionSizeFilter,
  CollectionSort,
  CollectionUserToggleFilter
} from "@/components/collection/filter"
import { WidgetModal } from "@/components/widgets"

type CollectionExplorerModalProps = Pick<
  React.ComponentProps<typeof CollectionExplorer>,
  'filter' | 'sort' | 'includeUser'
>

const CollectionExplorerModal = ({ filter, sort, includeUser }: CollectionExplorerModalProps) => {
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
        <Suspense fallback={<CollectionExplorerSkeleton className="flex flex-col gap-y-5" />}>
          <CollectionExplorer className="flex flex-col gap-y-5"
            cardProps={{ imageSize: 36 }}
            filter={filter}
            sort={sort}
            includeUser={includeUser}
          />
        </Suspense>
      </ScrollArea>
    </WidgetModal>
  )
}

export default CollectionExplorerModal
