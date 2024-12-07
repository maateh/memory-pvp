import { Suspense } from "react"

// types
import type { CollectionFilter, CollectionSort } from "@/components/collection/filter/types"

// server
import { getCollections } from "@/server/db/query/collection-query"

// constants
import { collectionSortOptions } from "@/components/collection/filter/constants"

// shadcn
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

// components
import { CollectionExplorer, CollectionExplorerSkeleton } from "@/components/collection/explorer"
import { CollectionNameFilter, CollectionSizeFilter, CollectionUserToggleFilter } from "@/components/collection/filter"
import { Popup, PopupContent, PopupHeader, PopupTrigger } from "@/components/popup"
import { Await, SortDropdownButton } from "@/components/shared"

type CollectionExplorerPopupProps = ({
  renderer: "trigger"
  collections: ClientCardCollection[]
  filter?: never
  sort?: never
} | {
  renderer: "router"
  filter: CollectionFilter
  sort: CollectionSort
  collections?: never
}) & Omit<React.ComponentProps<typeof PopupTrigger>, 'renderer'>

const CollectionExplorerPopup = ({
  renderer,
  collections,
  filter,
  sort,
  ...props
}: CollectionExplorerPopupProps) => {
  return (
    <Popup renderer={renderer}>
      <PopupTrigger renderer={renderer} {...props} />

      <PopupContent>
        <PopupHeader
          title="Browse collections"
          description="Browse the following card collections and choose the one you would like to play with."
        />

        <div className="max-w-xs px-6 space-y-2 md:px-0">
          <CollectionNameFilter />

          <div className="mt-1 flex items-center gap-x-2 sm:gap-x-3.5">
            <SortDropdownButton options={collectionSortOptions} />
            <CollectionSizeFilter />
            <CollectionUserToggleFilter includeByDefault />
          </div>
        </div>

        <Separator className="w-11/12 mx-auto my-5 md:my-2.5 bg-border/25" />

        <ScrollArea className="h-auto px-3 mb-4 overflow-y-auto md:pl-0 md:max-h-96">
          {renderer === "trigger" && (
            <CollectionExplorer className="md:grid-cols-2 2xl:grid-cols-2"
              cardProps={{ imageSize: 36 }}
              collections={collections}
            />
          )}

          {renderer === "router" && (
            <Suspense fallback={<CollectionExplorerSkeleton />}>
            <Await promise={getCollections({ filter, sort })}>
              {(collections) => (
                <CollectionExplorer className="md:grid-cols-2 2xl:grid-cols-2"
                  cardProps={{ imageSize: 36 }}
                  collections={collections}
                />
              )}
            </Await>
          </Suspense>
          )}
        </ScrollArea>
      </PopupContent>
    </Popup>
  )
}

export default CollectionExplorerPopup
