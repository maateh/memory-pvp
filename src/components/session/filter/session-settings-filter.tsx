"use client"

// types
import type { GameMode, GameSession, GameType, TableSize } from "@prisma/client"
import type { FilterStoreKey } from "@/hooks/store/use-filter-store"

// constants
import { gameModePlaceholders, gameTypePlaceholders, tableSizePlaceholders } from "@/constants/game"

// icons
import { ChevronRightCircle } from "lucide-react"

// shadcn
import { Breadcrumb, BreadcrumbButton, BreadcrumbItemGroup, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"

// hooks
import { setFilterStore, useFilterStore } from "@/hooks/store/use-filter-store"

type SettingsFilterFields = Pick<GameSession, 'type' | 'mode' | 'tableSize'>
type SettingsFilter = Filter<SettingsFilterFields>

const options: FilterOptions<SettingsFilterFields> = {
  type: ["CASUAL", "COMPETITIVE"],
  mode: ["SINGLE", "PVP", "COOP"],
  tableSize: ["SMALL", "MEDIUM", "LARGE"]
}

type SessionSettingsFilterProps = {
  filterKey: FilterStoreKey
}

const SessionSettingsFilter = ({ filterKey }: SessionSettingsFilterProps) => {
  const { filter } = useFilterStore<SettingsFilter>((state) => state[filterKey])

  const handleSelectType = (type: GameType) => {
    setFilterStore<SettingsFilter>((state) => {
      const filter = state[filterKey].filter

      if (filter.type === type) {
        state[filterKey].filter = { ...filter, type: undefined }
      } else {
        state[filterKey].filter = { ...filter, type }
      }

      return { [filterKey]: state[filterKey] }
    })
  }

  const handleSelectMode = (mode: GameMode) => {
    setFilterStore<SettingsFilter>((state) => {
      const filter = state[filterKey].filter

      if (filter.mode === mode) {
        state[filterKey].filter = { ...filter, mode: undefined, tableSize: undefined }
      } else {
        state[filterKey].filter = { ...filter, mode }
      }

      return { [filterKey]: state[filterKey] }
    })
  }

  const handleSelectTableSize = (tableSize: TableSize) => {
    setFilterStore<SettingsFilter>((state) => {
      const filter = state[filterKey].filter

      state[filterKey].filter = {
        ...filter,
        tableSize: filter.tableSize !== tableSize ? tableSize : undefined
      }

      return { [filterKey]: state[filterKey] }
    })
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

        {filter.type && (
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

        {filter.mode && (
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
export type { SettingsFilter as SessionSettingsFilter }
