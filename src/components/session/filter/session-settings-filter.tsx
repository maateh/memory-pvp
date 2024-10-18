"use client"

// types
import type { GameMode, GameSession, GameType, TableSize } from "@prisma/client"
import type { FilterFields, FilterKeys, FilterOptions } from "@/hooks/store/use-filter-store"

// constants
import { gameModePlaceholders, gameTypePlaceholders, tableSizePlaceholders } from "@/constants/game"

// icons
import { ChevronRightCircle } from "lucide-react"

// shadcn
import { Breadcrumb, BreadcrumbButton, BreadcrumbItemGroup, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"

// hooks
import { setFilterStore, useFilterStore } from "@/hooks/store/use-filter-store"

export type SessionSettingsFilter = FilterFields<GameSession, FilterKeys<GameSession, 'type' | 'mode' | 'tableSize'>>

const options: FilterOptions<SessionSettingsFilter> = {
  type: ["CASUAL", "COMPETITIVE"],
  mode: ["SINGLE", "PVP", "COOP"],
  tableSize: ["SMALL", "MEDIUM", "LARGE"]
}

const SessionSettingsFilter = () => {
  const filter = useFilterStore<SessionSettingsFilter, 'filter'>((state) => state.filter)

  const handleSelectType = (type: GameType) => {
    setFilterStore<SessionSettingsFilter>(({ filter }) => {
      if (!filter) return { filter }

      if (filter.type === type) {
        filter = {}
      } else {
        filter = { ...filter, type }
      }

      return { filter }
    })
  }

  const handleSelectMode = (mode: GameMode) => {
    setFilterStore<SessionSettingsFilter>(({ filter }) => {
      if (!filter) return { filter }

      if (filter.mode === mode) {
        filter = { ...filter, mode: undefined, tableSize: undefined }
      } else {
        filter = { ...filter, mode }
      }

      return { filter }
    })
  }

  const handleSelectTableSize = (tableSize: TableSize) => {
    setFilterStore<SessionSettingsFilter>(({ filter }) => {
      if (!filter) return { filter }

      filter = {
        ...filter,
        tableSize: filter.tableSize === tableSize ? undefined : tableSize
      }

      return { filter }
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
