"use client"

import { useMemo } from "react"

// types
import type { MatchFormat, SessionMode, TableSize } from "@repo/db"
import type { FilterService, FilterOptions } from "@/lib/types/search"
import type { FilterStoreKey } from "@/hooks/store/use-filter-store"
import type { SessionFilter } from "@repo/schema/session"

// schemas
import { sessionFilter } from "@repo/schema/session"

// config
import {
  matchFormatPlaceholders,
  sessionModePlaceholders,
  tableSizePlaceholders
} from "@repo/config/game"

// icons
import { ChevronRightCircle } from "lucide-react"

// shadcn
import { Breadcrumb, BreadcrumbButton, BreadcrumbItemGroup, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"

// hooks
import { setFilterStore, useFilterStore } from "@/hooks/store/use-filter-store"
import { useFilterParams } from "@/hooks/use-filter-params"

type TSessionSettingsFilter = Pick<SessionFilter, "mode" | "format" | "tableSize">

const options: FilterOptions<TSessionSettingsFilter> = {
  mode: ["CASUAL", "RANKED"],
  format: ["OFFLINE", "SOLO", "PVP", "COOP"],
  tableSize: ["SMALL", "MEDIUM", "LARGE"]
}

type SessionSettingsFilterProps = {
  filterKey: FilterStoreKey
  filterService?: FilterService
}

const SessionSettingsFilter = ({ filterKey, filterService = "params" }: SessionSettingsFilterProps) => {
  const filterStore = useFilterStore<TSessionSettingsFilter>((state) => state[filterKey])
  const { filter: filterParams, toggleFilterParam } = useFilterParams({
    filterSchema: sessionFilter.pick({ mode: true, format: true, tableSize: true })
  })

  const filter: TSessionSettingsFilter = useMemo(() => {
    return filterService === "store" ? filterStore : filterParams
  }, [filterService, filterStore, filterParams])

  const handleSelectMode = (mode: SessionMode) => {
    if (filterService === "store" || filterService === "mixed") {
      setFilterStore<TSessionSettingsFilter>((state) => {
        const filter = state[filterKey]
  
        if (filter.mode === mode) {
          state[filterKey] = { ...filter, mode: undefined }
        } else {
          state[filterKey] = { ...filter, mode }
        }
  
        return { [filterKey]: state[filterKey] }
      })
    }

    if (filterService === "params" || filterService === "mixed") {
      toggleFilterParam("mode", mode)
    }
  }

  const handleSelectFormat = (format: MatchFormat) => {
    if (filterService === "store" || filterService === "mixed") {
      setFilterStore<TSessionSettingsFilter>((state) => {
        const filter = state[filterKey]
  
        if (filter.format === format) {
          state[filterKey] = { ...filter, format: undefined, tableSize: undefined }
        } else {
          state[filterKey] = { ...filter, format }
        }
  
        return { [filterKey]: state[filterKey] }
      }) 
    }

    if (filterService === "params" || filterService === "mixed") {
      toggleFilterParam("format", format)
    }
  }

  const handleSelectTableSize = (tableSize: TableSize) => {
    if (filterService === "store" || filterService === "mixed") {
      setFilterStore<TSessionSettingsFilter>((state) => {
        const filter = state[filterKey]
  
        state[filterKey] = {
          ...filter,
          tableSize: filter.tableSize !== tableSize ? tableSize : undefined
        }
  
        return { [filterKey]: state[filterKey] }
      }) 
    }

    if (filterService === "params" || filterService === "mixed") {
      toggleFilterParam("tableSize", tableSize)
    }
  }

  return (
    <Breadcrumb>
      <BreadcrumbList className="sm:gap-y-1 sm:gap-x-1.5">
        <BreadcrumbItemGroup>
          {options.mode.map((mode) => (
            <BreadcrumbButton
              onClick={() => handleSelectMode(mode)}
              selected={filter.mode === mode}
              key={mode}
            >
              {sessionModePlaceholders[mode].label}
            </BreadcrumbButton>
          ))}
        </BreadcrumbItemGroup>

        <SessionBreadcrumbSeparator showNext={!!filter.mode} />

        {!!filter.mode && (
          <>
            <BreadcrumbItemGroup>
              {options.format.map((format) => (
                <BreadcrumbButton
                  onClick={() => handleSelectFormat(format)}
                  selected={filter.format === format}
                  key={format}
                >
                  {matchFormatPlaceholders[format].label}
                </BreadcrumbButton>
              ))}
            </BreadcrumbItemGroup>

            <SessionBreadcrumbSeparator showNext={!!filter.format} />
          </>
        )}

        {!!filter.format && (
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
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

const SessionBreadcrumbSeparator = ({ showNext = false }: { showNext?: boolean }) => {
  return (
    <BreadcrumbSeparator>
      {showNext ? (
        <ChevronRightCircle className="size-4 text-foreground/65" />
      ) : (
        <Separator className="w-0.5 h-4 rounded-full bg-border/60" orientation="vertical" />
      )}
    </BreadcrumbSeparator>
  )
}

export default SessionSettingsFilter
