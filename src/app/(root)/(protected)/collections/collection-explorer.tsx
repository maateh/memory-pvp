// types
import type { CollectionFilter } from "@/components/collection/filter/collection-filter"
import type { CollectionSort } from "@/components/collection/filter/collection-sort"

// server
import { getCollections } from "@/server/actions/collection"

// utils
import { parseFilterParams } from "@/lib/utils"

// shadcn
import { Skeleton } from "@/components/ui/skeleton"

// components
import { CardItem, Warning } from "@/components/shared"
import { CollectionWidgetList } from "@/components/collection/widget"

type CollectionExplorerProps = {
  params: CollectionFilter & CollectionSort
}

const CollectionExplorer = async ({ params }: CollectionExplorerProps) => {
  const searchParams = new URLSearchParams(params)

  const collections = await getCollections({
    ...parseFilterParams<typeof params>(searchParams),
    includeUser: true
  })

  if (collections.length === 0) {
    return (
      <CardItem className="py-3.5 justify-center">
        <Warning className="text-sm font-body font-normal dark:font-light tracking-wider sm:text-base"
          message="Couldn't find collection with the specified filter."
        />
      </CardItem>
    )
  }

  return (
    <CollectionWidgetList
      collections={collections}
    />
  )
}

const CollectionExplorerSkeleton = () => {
  return (
    <CollectionWidgetList>
      {Array(6).fill('').map((_, index) => (
        <li key={index}>
          <Skeleton className="h-32 bg-primary/80 rounded-2xl" />
        </li>
      ))}
    </CollectionWidgetList>
  )
}

export { CollectionExplorer, CollectionExplorerSkeleton }
