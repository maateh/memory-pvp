"use client"

import { useMemo } from "react"

// types
import type { GameMode, GameType, TableSize } from "@prisma/client"
import type { FilterService, FilterOptions } from "@/lib/types/query"
import type { FilterStoreKey } from "@/hooks/store/use-filter-store"
import type {
  SessionSettingsFilter as TSessionSettingsFilter,
  SessionSettingsFilterFields
} from "./types"

// config
import {
  gameModePlaceholders,
  gameTypePlaceholders,
  tableSizePlaceholders
} from "@/config/game-settings"

// icons
import { ChevronRightCircle } from "lucide-react"

// shadcn
import { Breadcrumb, BreadcrumbButton, BreadcrumbItemGroup, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"

// hooks
import { setFilterStore, useFilterStore } from "@/hooks/store/use-filter-store"
import { useFilterParams } from "@/hooks/use-filter-params"

const options: FilterOptions<SessionSettingsFilterFields> = {
  type: ["CASUAL", "COMPETITIVE"],
  mode: ["SINGLE", "PVP", "COOP"],
  tableSize: ["SMALL", "MEDIUM", "LARGE"]
}

type SessionSettingsFilterProps = {
  filterKey: FilterStoreKey
  filterService?: FilterService
}

const SessionSettingsFilter = ({ filterKey, filterService = "params" }: SessionSettingsFilterProps) => {
  const filterStore = useFilterStore<TSessionSettingsFilter>((state) => state[filterKey])
  const { filter: filterParams, toggleFilterParam } = useFilterParams<TSessionSettingsFilter>()

  const filter: TSessionSettingsFilter = useMemo(() => {
    return filterService === 'store' ? filterStore : filterParams
  }, [filterService, filterStore, filterParams])

  const handleSelectType = (type: GameType) => {
    if (filterService === 'store' || filterService === 'mixed') {
      setFilterStore<TSessionSettingsFilter>((state) => {
        const filter = state[filterKey]
  
        if (filter.type === type) {
          state[filterKey] = { ...filter, type: undefined }
        } else {
          state[filterKey] = { ...filter, type }
        }
  
        return { [filterKey]: state[filterKey] }
      })
    }

    if (filterService === 'params' || filterService === 'mixed') {
      toggleFilterParam('type', type)
    }
  }

  const handleSelectMode = (mode: GameMode) => {
    if (filterService === 'store' || filterService === 'mixed') {
      setFilterStore<TSessionSettingsFilter>((state) => {
        const filter = state[filterKey]
  
        if (filter.mode === mode) {
          state[filterKey] = { ...filter, mode: undefined, tableSize: undefined }
        } else {
          state[filterKey] = { ...filter, mode }
        }
  
        return { [filterKey]: state[filterKey] }
      }) 
    }

    if (filterService === 'params' || filterService === 'mixed') {
      toggleFilterParam('mode', mode)
    }
  }

  const handleSelectTableSize = (tableSize: TableSize) => {
    if (filterService === 'store' || filterService === 'mixed') {
      setFilterStore<TSessionSettingsFilter>((state) => {
        const filter = state[filterKey]
  
        state[filterKey] = {
          ...filter,
          tableSize: filter.tableSize !== tableSize ? tableSize : undefined
        }
  
        return { [filterKey]: state[filterKey] }
      }) 
    }

    if (filterService === 'params' || filterService === 'mixed') {
      toggleFilterParam('tableSize', tableSize)
    }
  }

  return (
    <Breadcrumb>
      <BreadcrumbList className="sm:gap-y-1 sm:gap-x-1.5">
        <BreadcrumbItemGroup>
          {options.type.map((type) => (
            <BreadcrumbButton
              onClick={() => handleSelectType(type)}
              selected={filter.type === type}
              key={type}
            >
              {gameTypePlaceholders[type].label}
            </BreadcrumbButton>
          ))}
        </BreadcrumbItemGroup>

        <SessionBreadcrumbSeparator showNext={!!filter.type} />

        {!!filter.type && (
          <>
            <BreadcrumbItemGroup>
              {options.mode.map((mode) => (
                <BreadcrumbButton
                  onClick={() => handleSelectMode(mode)}
                  selected={filter.mode === mode}
                  key={mode}
                >
                  {gameModePlaceholders[mode].label}
                </BreadcrumbButton>
              ))}
            </BreadcrumbItemGroup>

            <SessionBreadcrumbSeparator showNext={!!filter.mode} />
          </>
        )}

        {!!filter.mode && (
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
