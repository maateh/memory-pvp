"use client"

// types
import type { FilterOptions } from "@/lib/types/query"
import type { CollectionFilter, CollectionFilterFields } from "./types"

// config
import { tableSizePlaceholders } from "@repo/config/game"

// utils
import { cn } from "@/lib/util"

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
