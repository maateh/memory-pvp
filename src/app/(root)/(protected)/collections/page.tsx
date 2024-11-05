import Link from "next/link"
import { Suspense } from "react"

// types
import type {
  CollectionFilter as TCollectionFilter,
  CollectionSort as TCollectionSort
} from "@/components/collection/filter/types"

// constants
import { collectionSortOptions } from "@/components/collection/filter/constants"

// utils
import { cn, parseFilterParams } from "@/lib/utils"

// icons
import { ImageUp } from "lucide-react"

// shadcn
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// components
import { CollectionExplorer, CollectionExplorerSkeleton } from "@/components/collection"
import {
  CollectionNameFilter,
  CollectionSizeFilter,
  CollectionUserToggleFilter
} from "@/components/collection/filter"
import { SortDropdownButton } from "@/components/shared"

type CollectionsPageProps = {
  searchParams: TCollectionFilter & TCollectionSort
}

const CollectionsPage = ({ searchParams }: CollectionsPageProps) => {
  const params = new URLSearchParams(searchParams as {})
  const { filter, sort } = parseFilterParams<typeof searchParams>(params)

  const includeUser = !!filter.includeUser
  delete filter.includeUser

  return (
    <>
      <div className="flex flex-wrap-reverse justify-between items-end gap-x-16 gap-y-4">
        <div className="space-y-2">
          <CollectionNameFilter />

          <div className="mt-1 flex items-center gap-x-2 sm:gap-x-3.5">
            <SortDropdownButton options={collectionSortOptions} />
            <CollectionSizeFilter />
            <CollectionUserToggleFilter />
          </div>
        </div>

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

      <Suspense fallback={<CollectionExplorerSkeleton />}>
        <CollectionExplorer
          filter={filter}
          sort={sort}
          includeUser={includeUser}
        />
      </Suspense>
    </>
  )
}

export default CollectionsPage
