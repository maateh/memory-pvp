import { Suspense } from "react"

// types
import type { ClientCardCollection } from "@repo/schema/collection"
import type { PaginationParams } from "@/lib/types/query"
import type { CollectionFilter, CollectionSort } from "@/components/collection/filter/types"

// server
import { getCollections } from "@/server/db/query/collection-query"

// constants
import { collectionSortOptions } from "@/components/collection/filter/constants"

// shadcn
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { TableSkeleton } from "@/components/ui/table"

// components
import { CollectionNameFilter, CollectionSizeFilter, CollectionUserToggleFilter } from "@/components/collection/filter"
import { CollectionListing } from "@/components/collection/listing"
import { Popup, PopupContent, PopupFooter, PopupHeader, PopupTrigger } from "@/components/popup"
import { Await, PaginationHandler, SortDropdownButton } from "@/components/shared"

type CollectionExplorerPopupProps = ({
  renderer: "trigger"
  collections: ClientCardCollection[]
  filter?: never
  sort?: never
  pagination?: never
  searchParams?: never
} | {
  renderer: "router"
  filter: CollectionFilter
  sort: CollectionSort
  pagination: PaginationParams
  searchParams?: Record<string, string>
  collections?: never
}) & Omit<React.ComponentProps<typeof PopupTrigger>, 'renderer'>

const CollectionExplorerPopup = ({
  renderer,
  collections,
  filter,
  sort,
  pagination,
  searchParams,
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
            <CollectionUserToggleFilter />
          </div>
        </div>

        <Separator className="w-11/12 mx-auto my-5 md:my-2.5 bg-border/25" />

        {renderer === "trigger" && (
          <CollectionExplorerPopupContent collections={collections} />
        )}

        {renderer === "router" && (
          <Suspense fallback={<TableSkeleton rows={4} />}>
            <Await promise={getCollections({
              filter, sort,
              pagination: { ...pagination, limit: 6 }
            })}>
              {({ data: collections, ...pagination }) => (
                <>
                  <CollectionExplorerPopupContent collections={collections} />

                  {pagination.totalPage > 1 && (
                    <PopupFooter className="pt-0">
                      <PaginationHandler
                        pathname="/collections/explorer"
                        searchParams={searchParams as {}}
                        pagination={pagination}
                      />
                    </PopupFooter>
                  )}
                </>
              )}
            </Await>
          </Suspense>
        )}
      </PopupContent>
    </Popup>
  )
}

const CollectionExplorerPopupContent = ({ collections }: { collections: ClientCardCollection[] }) => (
  <ScrollArea className="h-auto px-3 mb-4 overflow-y-auto md:pl-0 md:max-h-96">
    <CollectionListing
      collections={collections}
      metadata={{ type: "listing" }}
      imageSize={36}
    />
  </ScrollArea>
)

export default CollectionExplorerPopup
