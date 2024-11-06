"use client"

// types
import type { CollectionFilter, CollectionFilterFields } from "./types"

// constants
import { tableSizePlaceholders } from "@/constants/game"

// utils
import { cn } from "@/lib/utils"

// shadcn
import { Breadcrumb, BreadcrumbButton, BreadcrumbItemGroup, BreadcrumbList } from "@/components/ui/breadcrumb"

// hooks
import { useFilterParams } from "@/hooks/use-filter-params"

const options: FilterOptions<Pick<CollectionFilterFields, 'tableSize'>> = {
  tableSize: ['SMALL', 'MEDIUM', 'LARGE']
}

const CollectionSizeFilter = ({ className, ...props }: React.ComponentProps<typeof BreadcrumbList>) => {
  const { filter, toggleFilterParam } = useFilterParams<CollectionFilter>()

  return (
    <Breadcrumb>
      <BreadcrumbList className={cn("sm:gap-y-1 sm:gap-x-1.5", className)} {...props}>
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

export default CollectionSizeFilter
