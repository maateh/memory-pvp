"use client"

import { useState } from "react"

// prisma
import type { GameMode, GameSession, GameType, TableSize } from "@prisma/client"

// constants
import { gameModePlaceholders, gameTypePlaceholders, tableSizePlaceholders } from "@/constants/game"

// icons
import { ChevronRightCircle } from "lucide-react"

// shadcn
import { Breadcrumb, BreadcrumbButton, BreadcrumbItemGroup, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"

type SessionFilterFields = Pick<GameSession, 'type' | 'mode' | 'tableSize'>

type SessionFilter = Partial<SessionFilterFields>

type SessionFilterOptions = {
  [key in keyof SessionFilterFields]: GameSession[key][]
}

const options: SessionFilterOptions = {
  type: ["CASUAL", "COMPETITIVE"],
  mode: ["SINGLE", "PVP", "COOP"],
  tableSize: ["SMALL", "MEDIUM", "LARGE"]
}

const SessionBreadcrumbFilter = () => {
  const [filter, setFilter] = useState<SessionFilter>({})

  const handleSelectType = (type: GameType) => {
    setFilter((prev) => {
      if (prev.type === type) {
        return {}
      }

      return { ...prev, type }
    })
  }

  const handleSelectMode = (mode: GameMode) => {
    setFilter((prev) => {
      if (prev.mode === mode) {
        return { type: prev.type, mode: undefined }
      }

      return { ...prev, mode }
    })
  }

  const handleSelectTableSize = (tableSize: TableSize) => {
    setFilter((prev) => ({
      ...prev,
      tableSize: prev.tableSize === tableSize ? undefined : tableSize
    }))
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

export default SessionBreadcrumbFilter
