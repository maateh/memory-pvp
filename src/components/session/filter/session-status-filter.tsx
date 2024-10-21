"use client"

// types
import type { GameSession, GameStatus } from "@prisma/client"
import type { FilterFields, FilterMapKeys, FilterOptions } from "@/hooks/store/use-filter-store"

// utils
import { cn } from "@/lib/utils"

// shadcn
import { Breadcrumb, BreadcrumbButton, BreadcrumbItemGroup, BreadcrumbList } from "@/components/ui/breadcrumb"

// hooks
import { setFilterStore, useFilterStore } from "@/hooks/store/use-filter-store"

type StatusFilter = FilterFields<GameSession, 'status'>

const options: FilterOptions<StatusFilter> = {
  status: ["RUNNING", "FINISHED", "ABANDONED", "OFFLINE"]
}

type SessionStatusFilterProps = {
  filterKey: FilterMapKeys
}

const SessionStatusFilter = ({ filterKey }: SessionStatusFilterProps) => {
  const filter = useFilterStore<StatusFilter>((state) => state[filterKey].filter)

  const handleSelectStatus = (status: GameStatus) => {
    setFilterStore<StatusFilter>((state) => {
      const filter = state[filterKey].filter

      state[filterKey].filter = {
        ...filter,
        status: filter.status !== status ? status : undefined
      }

      return { [filterKey]: state[filterKey] }
    })
  }

  return (
    <Breadcrumb>
      <BreadcrumbList className="sm:gap-y-1 sm:gap-x-1.5">
        <BreadcrumbItemGroup className="flex-wrap">
          {options.status.map((status) => (
            <BreadcrumbButton className={cn("capitalize", {
              "text-secondary-foreground bg-secondary/75 hover:bg-secondary/85": filter.status === status
            })}
              onClick={() => handleSelectStatus(status)}
              selected={filter.status === status}
              key={status}
            >
              {status.toLowerCase()}
            </BreadcrumbButton>
          ))}
        </BreadcrumbItemGroup>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default SessionStatusFilter
export type { StatusFilter as SessionStatusFilter }
