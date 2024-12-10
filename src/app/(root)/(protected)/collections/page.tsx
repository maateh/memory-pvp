import Link from "next/link"
import { Suspense } from "react"

// types
import type { CollectionFilter, CollectionSort } from "@/components/collection/filter/types"

// server
import { getCollections } from "@/server/db/query/collection-query"

// constants
import { collectionSortOptions } from "@/components/collection/filter/constants"

// utils
import { cn } from "@/lib/util"
import { parseFilterParams } from "@/lib/util/parser"

// icons
import { ImageUp } from "lucide-react"

// shadcn
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// components
import { CollectionExplorerSkeleton } from "@/components/collection/explorer"
import {
  CollectionNameFilter,
  CollectionSizeFilter,
  CollectionUserToggleFilter
} from "@/components/collection/filter"
import { CollectionListing } from "@/components/collection/listing"
import { Await, SortDropdownButton } from "@/components/shared"

type CollectionsPageProps = {
  searchParams: CollectionFilter & CollectionSort
}

const CollectionsPage = ({ searchParams }: CollectionsPageProps) => {
  const params = new URLSearchParams(searchParams as {})
  const { filter, sort } = parseFilterParams<typeof searchParams>(params)

  return (
    <>
      <div className="flex flex-wrap-reverse justify-between items-end gap-x-16 gap-y-4">
        <div className="space-y-2">
          <CollectionNameFilter />

          <div className="mt-1 flex items-center gap-x-2 sm:gap-x-3.5">
            <SortDropdownButton className="xl:hidden"
              options={collectionSortOptions}
            />

            <CollectionSizeFilter />
            <CollectionUserToggleFilter />
          </div>
        </div>

        {/* TODO: redesign + replace with button */}
        <Link className={cn(buttonVariants({
          className: "ml-auto gap-x-3 rounded-2xl font-medium tracking-wide",
          variant: "secondary",
          size: "lg"
        }))}
          href="/collections/manage"
          scroll={false}
        >
          <div>
            Manage your collections
          </div>
          <ImageUp className="size-5 mx-auto sm:size-6" />
        </Link>
      </div>

      <Separator className="w-11/12 my-5 mx-auto bg-border/15" />

      {/* TODO: redesign skeleton fallback */}
      <Suspense fallback={<CollectionExplorerSkeleton />}>
        <Await promise={getCollections({ filter, sort })}>
          {(collections) => (
            <CollectionListing
              collections={collections}
              metadata={{ type: "listing" }}
              imageSize={38}
            />
          )}
        </Await>
      </Suspense>
    </>
  )
}

export default CollectionsPage
