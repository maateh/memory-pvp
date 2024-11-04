import Link from "next/link"
import { Suspense } from "react"

// types
import type {
  CollectionFilter as TCollectionFilter,
  CollectionSort as TCollectionSort
} from "@/components/collection/filter/types"

// server
import { getCollections } from "@/server/actions/collection"

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
  CollectionSort,
  CollectionUserToggleFilter
} from "@/components/collection/filter"

type CollectionsPageProps = {
  searchParams: TCollectionFilter & TCollectionSort
}

const CollectionsPage = async ({ searchParams }: CollectionsPageProps) => {
  const params = new URLSearchParams(searchParams as {})
  const { filter, sort } = parseFilterParams<typeof searchParams>(params)

  const includeUser = !!filter.includeUser
  delete filter.includeUser

  const collections = await getCollections({ filter, sort, includeUser })

  return (
    <>
      <div className="flex flex-wrap-reverse justify-between items-end gap-x-16 gap-y-4">
        <div className="space-y-2">
          <CollectionNameFilter />

          <div className="mt-1 flex items-center gap-x-2 sm:gap-x-3.5">
            <CollectionSort />
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
        <CollectionExplorer collections={collections} />
      </Suspense>
    </>
  )
}

export default CollectionsPage
