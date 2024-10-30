"use client"

// types
import type { CardCollection, TableSize } from "@prisma/client"
import type { Filter, FilterOptions } from "@/hooks/store/use-filter-store"

// constants
import { tableSizePlaceholders } from "@/constants/game"

// shadcn
import { Breadcrumb, BreadcrumbButton, BreadcrumbItemGroup, BreadcrumbList } from "@/components/ui/breadcrumb"

// hooks
import { useFilterParams } from "@/hooks/use-filter-params"

type CollectionFilterFields = Pick<CardCollection, 'tableSize' | 'name'>

type TCollectionFilter = Filter<CollectionFilterFields>

const options: FilterOptions<CollectionFilterFields> = {
  name: [''],
  tableSize: ['SMALL', 'MEDIUM', 'LARGE']
}

const CollectionFilter = () => {
  const { filter, toggleFilterParam } = useFilterParams<TCollectionFilter>()

  // TODO: add search filter input
  // TODO: add exclude or include user toggle button

  return (
    <Breadcrumb>
      <BreadcrumbList className="sm:gap-y-1 sm:gap-x-1.5">
        <BreadcrumbItemGroup>
          {options.tableSize.map((tableSize) => (
            <BreadcrumbButton
              onClick={() => toggleFilterParam('tableSize', tableSize)}
              selected={filter.tableSize === tableSize}
              key={tableSize}
            >
              {tableSizePlaceholders[tableSize].label}
            </BreadcrumbButton>
          ))}
        </BreadcrumbItemGroup>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default CollectionFilter
export type { TCollectionFilter as CollectionFilter }
