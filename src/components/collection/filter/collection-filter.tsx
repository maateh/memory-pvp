"use client"

// types
import type { CardCollection, TableSize } from "@prisma/client"
import type { Filter, FilterOptions } from "@/hooks/store/use-filter-store"

// constants
import { tableSizePlaceholders } from "@/constants/game"

// shadcn
import { Breadcrumb, BreadcrumbButton, BreadcrumbItemGroup, BreadcrumbList } from "@/components/ui/breadcrumb"

// hooks
import { setFilterStore, useFilterStore } from "@/hooks/store/use-filter-store"
import { useFilterParams } from "@/hooks/use-filter-params"

type CollectionFilterFields = Pick<CardCollection, 'tableSize' | 'name'>
type TCollectionFilter = Filter<CollectionFilterFields>

const options: FilterOptions<CollectionFilterFields> = {
  name: [''],
  tableSize: ['SMALL', 'MEDIUM', 'LARGE']
}

type CollectionFilterProps = {
  type: FilterService
}

const CollectionFilter = ({ type }: CollectionFilterProps) => {
  const filter = useFilterStore<TCollectionFilter>(({ collections }) => collections.filter)
  const { filter: queryFilter, addFilterParam } = useFilterParams<TCollectionFilter>()

  const handleSelectTableSize = (tableSize: TableSize) => {
    if (type === 'store' || type === 'mixed') {
      setFilterStore<TCollectionFilter>(({ collections }) => {
        collections.filter = {
          ...filter,
          tableSize: filter.tableSize !== tableSize ? tableSize : undefined
        }
  
        return { collections }
      })
    }

    if (type === 'params' || type === 'mixed') {
      addFilterParam('tableSize', tableSize)
    }
  }

  const isTableSizeSelected = (tableSize: TableSize) => {
    let isSelected = false
    if (type === 'store' || type === 'mixed') {
      isSelected = filter.tableSize === tableSize
    }

    if (type === 'params' || type === 'mixed') {
      isSelected = queryFilter.tableSize === tableSize
    }

    return isSelected
  }

  // TODO: add search filter input

  return (
    <Breadcrumb>
      <BreadcrumbList className="sm:gap-y-1 sm:gap-x-1.5">
        <BreadcrumbItemGroup>
          {options.tableSize.map((tableSize) => (
            <BreadcrumbButton
              onClick={() => handleSelectTableSize(tableSize)}
              selected={isTableSizeSelected(tableSize)}
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
