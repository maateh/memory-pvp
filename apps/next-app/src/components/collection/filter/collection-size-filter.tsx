"use client"

// types
import type { CollectionFilter } from "@repo/schema/collection"
import type { FilterOptions } from "@/lib/types/search"

// schemas
import { collectionFilter } from "@repo/schema/collection"

// config
import { tableSizePlaceholders } from "@repo/config/game"

// utils
import { cn } from "@/lib/util"

// shadcn
import { Breadcrumb, BreadcrumbButton, BreadcrumbItemGroup, BreadcrumbList } from "@/components/ui/breadcrumb"

// hooks
import { useSearch } from "@/hooks/use-search"

const options: FilterOptions<Pick<CollectionFilter, "tableSize">> = {
  tableSize: ["SMALL", "MEDIUM", "LARGE"]
}

const CollectionSizeFilter = ({ className, ...props }: React.ComponentProps<typeof BreadcrumbList>) => {
  const { filter, toggleFilterParam } = useSearch({
    filterSchema: collectionFilter.pick({ tableSize: true })
  })

  return (
    <Breadcrumb>
      <BreadcrumbList className={cn("sm:gap-y-1 sm:gap-x-1.5", className)} {...props}>
        <BreadcrumbItemGroup>
          {options.tableSize.map((tableSize) => (
            <BreadcrumbButton
              onClick={() => toggleFilterParam("tableSize", tableSize)}
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
