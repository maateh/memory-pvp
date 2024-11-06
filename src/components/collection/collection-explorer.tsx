// types
import type { CollectionFilter, CollectionSort } from "@/components/collection/filter/types"

// server
import { getCollections } from "@/server/db/collection"

// utils
import { cn } from "@/lib/utils"

// shadcn
import { Skeleton } from "@/components/ui/skeleton"

// components
import { CardItem, Warning } from "@/components/shared"
import { CollectionCard } from "@/components/collection"

type CollectionExplorerProps = {
  filter: CollectionFilter
  sort: CollectionSort
  includeUser: boolean | undefined
  cardProps?: Omit<React.ComponentProps<typeof CollectionCard>, 'collection'>
} & React.ComponentProps<"ul">

const CollectionExplorer = async ({
  filter, sort, includeUser,
  cardProps,
  className,
  ...props
}: CollectionExplorerProps) => {
  const collections = await getCollections({ filter, sort, includeUser })

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
    <ul className={cn("grid gap-x-10 gap-y-8 xl:grid-cols-2 2xl:grid-cols-3", className)} {...props}>
      {collections.map((collection) => (
        <li key={collection.id}>
          <CollectionCard {...cardProps}
            collection={collection}
            key={collection.id}
          />
        </li>
      ))}
    </ul>
  )
}

type CollectionExplorerSkeletonProps = {
  skeletonProps?: React.ComponentProps<typeof Skeleton>
} & React.ComponentProps<"ul">

const CollectionExplorerSkeleton = ({ skeletonProps, className, ...props }: CollectionExplorerSkeletonProps) => {
  return (
    <ul className={cn("grid gap-x-10 gap-y-8 xl:grid-cols-2 2xl:grid-cols-3", className)} {...props}>
      {Array(6).fill('').map((_, index) => (
        <li key={index}>
          <Skeleton {...skeletonProps}
            className={cn("h-32 bg-primary/80 rounded-2xl", skeletonProps?.className)}
          />
        </li>
      ))}
    </ul>
  )
}

export { CollectionExplorer, CollectionExplorerSkeleton }
