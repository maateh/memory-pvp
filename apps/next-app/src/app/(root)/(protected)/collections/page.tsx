import Link from "next/link"
import { Suspense } from "react"

// types
import type { CollectionFilter, CollectionSort } from "@repo/schema/collection"

// server
import { getCollections } from "@/server/db/query/collection-query"

// constants
import { collectionSortOptions } from "@/components/collection/filter/constants"

// utils
import { parseFilterParams } from "@/lib/util/parser"

// icons
import { ImageUp } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { TableSkeleton } from "@/components/ui/table"

// components
import {
  CollectionNameFilter,
  CollectionSizeFilter,
  CollectionUserToggleFilter
} from "@/components/collection/filter"
import { CollectionListing } from "@/components/collection/listing"
import { Await, PaginationHandler, SortDropdownButton } from "@/components/shared"

type CollectionsPageProps = {
  searchParams: CollectionFilter & CollectionSort
}

const CollectionsPage = ({ searchParams }: CollectionsPageProps) => {
  const params = new URLSearchParams(searchParams as {})
  const { filter, sort, pagination } = parseFilterParams<typeof searchParams>(params)

  return (
    <>
      <div className="flex flex-wrap-reverse justify-center items-center gap-x-24 gap-y-8 md:gap-x-12 md:gap-y-4">
        <div className="space-y-2 mr-auto">
          <CollectionNameFilter />

          <div className="mt-1 flex items-center gap-x-2 sm:gap-x-3.5">
            <SortDropdownButton options={collectionSortOptions} />
            <CollectionSizeFilter />
            <CollectionUserToggleFilter />
          </div>
        </div>

        <Button className="flex-1 max-w-80 px-4 py-6 flex flex-col items-center gap-y-2 rounded-2xl tracking-wide border border-border/25 border-dashed bg-border/5 hover:bg-border/10"
          variant="ghost"
          size="icon"
          asChild
        >
          <Link href="/collections/manage">
            <ImageUp className="size-5 sm:size-6 shrink-0 text-accent" />
            <span className="mt-1 text-muted-foreground font-heading font-semibold">
              Manage collections
            </span>
          </Link>
        </Button>
      </div>

      <Separator className="w-11/12 my-5 mx-auto bg-border/15" />

      <Suspense fallback={<TableSkeleton columns={6} rows={7} />}>
        <Await promise={getCollections({ filter, sort, pagination })}>
          {({ data: collections, ...pagination }) => (
            <>
              <CollectionListing
                collections={collections}
                metadata={{ type: "listing" }}
                imageSize={36}
              />

              {pagination.totalPage > 1 && (
                <PaginationHandler className="pt-5"
                  pathname="/collections"
                  searchParams={searchParams as {}}
                  pagination={pagination}
                />
              )}
            </>
          )}
        </Await>
      </Suspense>
    </>
  )
}

export default CollectionsPage
