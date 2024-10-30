import Link from "next/link"
import { Suspense } from "react"

// types
import type { CollectionFilter as TCollectionFilter } from "@/components/collection/filter/collection-filter"
import type { CollectionSort as TCollectionSort } from "@/components/collection/filter/collection-sort"

// utils
import { cn } from "@/lib/utils"

// icons
import { ImageUp } from "lucide-react"

// shadcn
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// components
import { CollectionFilter, CollectionSort } from "@/components/collection/filter"
import { CollectionExplorer, CollectionExplorerSkeleton } from "./collection-explorer"

type CollectionsPageProps = {
  searchParams: TCollectionFilter & TCollectionSort
}

const CollectionsPage = ({ searchParams }: CollectionsPageProps) => {
  return (
    <>
      <div className="flex flex-wrap-reverse justify-between items-end gap-x-16 gap-y-4">
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
        <CollectionExplorer params={searchParams} />
      </Suspense>
    </>
  )
}

export default CollectionsPage
