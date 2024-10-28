"use client"

// types
import type { CollectionFilter } from "@/components/collection/filter/collection-filter"
import type { CollectionSort } from "@/components/collection/filter/collection-sort"

// trpc
import { api } from "@/trpc/client"

// shadcn
import { Skeleton } from "@/components/ui/skeleton"

// components
import { CardItem, Warning } from "@/components/shared"
import { CollectionWidgetList } from "@/components/collection/widget"

// hooks
import { useFilterStore } from "@/hooks/store/use-filter-store"

type CollectionExplorerProps = {
  excludeUser?: boolean
}

const CollectionExplorer = ({ excludeUser = false }: CollectionExplorerProps) => {
  const filter = useFilterStore<CollectionFilter>(({ collections }) => collections.filter)
  const sort = useFilterStore<CollectionSort>(({ collections }) => collections.sort)

  const { data: collections, isFetching } = api.collection.get.useQuery({ filter, sort, excludeUser })

  if (!collections || isFetching) {
    return (
      <CollectionWidgetList>
        {Array(6).fill('').map((_, index) => (
          <li key={index}>
            <Skeleton className="h-40 bg-primary/80 rounded-2xl" />
          </li>
        ))}
      </CollectionWidgetList>
    )
  }

  if (collections.length === 0) {
    return (
      <CardItem className="py-3.5 justify-center">
        <Warning className="text-sm font-body font-normal dark:font-light tracking-wider sm:text-base"
          message="Couldn't find collection with the specified filter."
        />
      </CardItem>
    )
  }

  return <CollectionWidgetList collections={collections} />
}

export default CollectionExplorer
