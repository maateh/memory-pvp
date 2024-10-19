"use client"

// types
import type { GameSession, GameStatus } from "@prisma/client"
import type { FilterFields, FilterOptions } from "@/hooks/store/use-filter-store"

// utils
import { cn } from "@/lib/utils"

// shadcn
import { Breadcrumb, BreadcrumbButton, BreadcrumbItemGroup, BreadcrumbList } from "@/components/ui/breadcrumb"

// hooks
import { setFilterStore, useFilterStore } from "@/hooks/store/use-filter-store"

export type SessionStatusFilter = FilterFields<GameSession, 'status'>

const options: FilterOptions<SessionStatusFilter> = {
  status: ["RUNNING", "FINISHED", "ABANDONED", "OFFLINE"]
}

const SessionStatusFilter = () => {
  const filter = useFilterStore<SessionStatusFilter>(({ session }) => session.filter)

  const handleSelectStatus = (status: GameStatus) => {
    setFilterStore<SessionStatusFilter>(({ session }) => {
      const filter = session.filter

      session.filter = {
        ...filter,
        status: filter.status !== status ? status : undefined
      }

      return { session }
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
