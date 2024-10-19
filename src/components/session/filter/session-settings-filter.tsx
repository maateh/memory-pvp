"use client"

// types
import type { GameMode, GameSession, GameType, TableSize } from "@prisma/client"
import type { FilterFields, FilterOptions } from "@/hooks/store/use-filter-store"

// constants
import { gameModePlaceholders, gameTypePlaceholders, tableSizePlaceholders } from "@/constants/game"

// icons
import { ChevronRightCircle } from "lucide-react"

// shadcn
import { Breadcrumb, BreadcrumbButton, BreadcrumbItemGroup, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"

// hooks
import { setFilterStore, useFilterStore } from "@/hooks/store/use-filter-store"

type SettingsFilter = FilterFields<GameSession, 'type' | 'mode' | 'tableSize'>

const options: FilterOptions<SettingsFilter> = {
  type: ["CASUAL", "COMPETITIVE"],
  mode: ["SINGLE", "PVP", "COOP"],
  tableSize: ["SMALL", "MEDIUM", "LARGE"]
}

const SessionSettingsFilter = () => {
  const filter = useFilterStore<SettingsFilter>((state) => state.session.filter)

  const handleSelectType = (type: GameType) => {
    setFilterStore<SettingsFilter>(({ session }) => {
      const filter = session.filter

      if (filter.type === type) {
        session.filter = { ...filter, type: undefined }
      } else {
        session.filter = { ...filter, type }
      }

      return { session }
    })
  }

  const handleSelectMode = (mode: GameMode) => {
    setFilterStore<SettingsFilter>(({ session }) => {
      const filter = session.filter

      if (filter.mode === mode) {
        session.filter = { ...filter, mode: undefined, tableSize: undefined }
      } else {
        session.filter = { ...filter, mode }
      }

      return { session }
    })
  }

  const handleSelectTableSize = (tableSize: TableSize) => {
    setFilterStore<SettingsFilter>(({ session }) => {
      const filter = session.filter

      session.filter = {
        ...filter,
        tableSize: filter.tableSize !== tableSize ? tableSize : undefined
      }

      return { session }
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
