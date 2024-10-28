"use client"

// types
import type { CardCollection, TableSize } from "@prisma/client"
import type { FilterFields, FilterOptions } from "@/hooks/store/use-filter-store"

// constants
import { tableSizePlaceholders } from "@/constants/game"

// shadcn
import { Breadcrumb, BreadcrumbButton, BreadcrumbItemGroup, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

// hooks
import { setFilterStore, useFilterStore } from "@/hooks/store/use-filter-store"

type TCollectionFilter = FilterFields<CardCollection, 'tableSize' | 'name'>

const options: FilterOptions<TCollectionFilter> = {
  name: [''],
  tableSize: ['SMALL', 'MEDIUM', 'LARGE']
}

const CollectionFilter = () => {
  const filter = useFilterStore<TCollectionFilter>(({ collections }) => collections.filter)

  const handleSelectTableSize = (tableSize: TableSize) => {
    setFilterStore<TCollectionFilter>(({ collections }) => {
      collections.filter = {
        ...filter,
        tableSize: filter.tableSize !== tableSize ? tableSize : undefined
      }

      return { collections }
    })
  }

  // TODO: add search filter input

  return (
    <Breadcrumb>
      <BreadcrumbList className="sm:gap-y-1 sm:gap-x-1.5">
        <BreadcrumbItemGroup>
          {options.tableSize.map((tableSize) => (
            <BreadcrumbButton
              onClick={() => handleSelectTableSize(tableSize)}
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
