"use client"

import { useMemo } from "react"

// types
import type { SessionStatus } from "@repo/db"
import type { FilterService, FilterOptions } from "@/lib/types/query"
import type { FilterStoreKey } from "@/hooks/store/use-filter-store"
import type {
  SessionStatusFilter as TSessionStatusFilter,
  SessionStatusFilterFields
} from "./types"

// utils
import { cn } from "@/lib/util"

// shadcn
import { Breadcrumb, BreadcrumbButton, BreadcrumbItemGroup, BreadcrumbList } from "@/components/ui/breadcrumb"

// hooks
import { setFilterStore, useFilterStore } from "@/hooks/store/use-filter-store"
import { useFilterParams } from "@/hooks/use-filter-params"

const options: FilterOptions<SessionStatusFilterFields> = {
  status: ["RUNNING", "FINISHED", "CLOSED", "FORCE_CLOSED"]
}

type SessionStatusFilterProps = {
  filterKey: FilterStoreKey
  filterService?: FilterService
}

const SessionStatusFilter = ({ filterKey, filterService = "params" }: SessionStatusFilterProps) => {
  const filterStore = useFilterStore<TSessionStatusFilter>((state) => state[filterKey])
  const { filter: filterParams, toggleFilterParam } = useFilterParams<TSessionStatusFilter>()

  const filter: TSessionStatusFilter = useMemo(() => {
    return filterService === 'store' ? filterStore : filterParams
  }, [filterService, filterStore, filterParams])

  const handleSelectStatus = (status: SessionStatus) => {
    if (filterService === "store" || filterService === "mixed") {
      setFilterStore<TSessionStatusFilter>((state) => {
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
