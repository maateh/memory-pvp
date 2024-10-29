"use client"

// types
import type { CardCollection } from "@prisma/client"
import type { Sort } from "@/hooks/store/use-filter-store"

// utils
import { cn } from "@/lib/utils"

// icons
import { SortAsc, SortDesc } from "lucide-react"

// shadcn
import { ButtonTooltip } from "@/components/ui/button"

// hooks
import { setFilterStore, useFilterStore } from "@/hooks/store/use-filter-store"
import { useFilterParams } from "@/hooks/use-filter-params"

type CollectionSortFields = Pick<CardCollection, 'createdAt'>

type TCollectionSort = Sort<CollectionSortFields>

type CollectionSortProps = {
  type: FilterService
}

const CollectionSort = ({ type }: CollectionSortProps) => {
  const sort = useFilterStore<TCollectionSort>(({ collections }) => collections.sort)
  const { toggleSortParam } = useFilterParams<TCollectionSort>()

  const handleToggleSort = () => {
    if (type === 'store' || type === 'mixed') {
      setFilterStore<TCollectionSort>(({ collections }) => {
        collections.sort = {
          ...sort,
          createdAt: sort.createdAt === 'asc' ? 'desc' : 'asc'
        }
  
        return { collections }
      })
    }

    if (type === 'params' || type === 'mixed') {
      toggleSortParam('createdAt')
    }
  }

  return (
    <ButtonTooltip className="p-1.5 hover:bg-transparent/10 dark:hover:bg-transparent/30 border border-border/20"
      variant="ghost"
      size="icon"
      onClick={handleToggleSort}
      tooltip={(
        <div className="flex items-center gap-x-1.5">
          <SortAsc className={cn("size-4 flex-none", { "hidden": sort.createdAt === 'desc' })} />
          <SortDesc className={cn("size-4 flex-none", { "hidden": sort.createdAt === 'asc' })} />

          <p className="font-light dark:font-extralight">
            Sort by <span className={cn("text-destructive font-medium", { "text-accent": sort.createdAt === 'desc' })}>
              {sort.createdAt === 'desc' ? 'recently' : 'previously'}
            </span> added
          </p>
        </div>
      )}
    >
      <SortAsc className={cn("size-4 sm:size-5 flex-none transition-all", {
        "rotate-0 scale-100": sort.createdAt === 'asc',
        "-rotate-90 scale-0": sort.createdAt === 'desc'
      })} strokeWidth={2.5} />

      <SortDesc className={cn("absolute size-4 sm:size-5 flex-none transition-all", {
        "rotate-90 scale-0": sort.createdAt === 'asc',
        "rotate-0 scale-100": sort.createdAt === 'desc'
      })} strokeWidth={2.5} />
    </ButtonTooltip>
  )
}

export default CollectionSort
export type { TCollectionSort as CollectionSort }
