"use client"

import { useMemo } from "react"

// types
import type { SessionStatus } from "@repo/db"
import type { FilterService, FilterOptions } from "@/lib/types/search"
import type { FilterStoreKey } from "@/hooks/store/use-filter-store"
import type { SessionFilter } from "@repo/schema/session"

// schemas
import { sessionFilter } from "@repo/schema/session"

// utils
import { cn } from "@/lib/util"

// shadcn
import { Breadcrumb, BreadcrumbButton, BreadcrumbItemGroup, BreadcrumbList } from "@/components/ui/breadcrumb"

// hooks
import { setFilterState, useFilterStore } from "@/hooks/store/use-filter-store"
import { useSearch } from "@/hooks/use-search"

type TSessionStatusFilter = Pick<SessionFilter, "status">

const options: FilterOptions<TSessionStatusFilter> = {
  status: ["RUNNING", "FINISHED", "CLOSED", "FORCE_CLOSED"]
}

type SessionStatusFilterProps = {
  filterKey: FilterStoreKey
  filterService?: FilterService
}

const SessionStatusFilter = ({ filterKey, filterService = "params" }: SessionStatusFilterProps) => {
  const storeFilter = useFilterStore<TSessionStatusFilter>((state) => state[filterKey])
  const { filter: searchFilter, toggleFilterParam } = useSearch({
    filterSchema: sessionFilter.pick({ status: true })
  })

  const filter = useMemo(() => {
    return filterService === "store" ? storeFilter : searchFilter
  }, [filterService, storeFilter, searchFilter])

  const handleSelectStatus = (status: SessionStatus) => {
    if (filterService === "store" || filterService === "mixed") {
      setFilterState<TSessionStatusFilter>((state) => {
        const filter = state[filterKey]
  
        state[filterKey] = {
          ...filter,
          status: filter.status !== status ? status : undefined
        }
  
        return { [filterKey]: state[filterKey] }
      })
    }

    if (filterService === "params" || filterService === "mixed") {
      toggleFilterParam("status", status)
    }
  }

  return (
    <Breadcrumb>
      <BreadcrumbList className="sm:gap-y-1 sm:gap-x-1.5">
        <BreadcrumbItemGroup className="flex-wrap">
          {options.status.map((status) => (
            <BreadcrumbButton className={cn("block first-letter:uppercase", {
              "text-secondary-foreground bg-secondary/75 hover:bg-secondary/85": filter.status === status
            })}
              onClick={() => handleSelectStatus(status)}
              selected={filter.status === status}
              key={status}
            >
              {status.replaceAll("_", " ").toLowerCase()}
            </BreadcrumbButton>
          ))}
        </BreadcrumbItemGroup>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default SessionStatusFilter
