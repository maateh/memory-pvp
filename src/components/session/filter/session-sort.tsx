"use client"

// types
import type { GameSession } from "@prisma/client"
import type { SortFields } from "@/hooks/store/use-filter-store"

// utils
import { cn } from "@/lib/utils"

// icons
import { SortAsc, SortDesc } from "lucide-react"

// shadcn
import { ButtonTooltip } from "@/components/ui/button"

// hooks
import { setFilterStore, useFilterStore } from "@/hooks/store/use-filter-store"

export type SessionSort = SortFields<GameSession, 'startedAt'>

const SessionSort = () => {
  const sort = useFilterStore<SessionSort>(({ session }) => session.sort)

  const handleToggleSort = () => {
    setFilterStore<SessionSort>(({ session }) => {
      const sort = session.sort

      session.sort = {
        ...sort,
        startedAt: sort.startedAt === 'asc' ? 'desc' : 'asc'
      }

      return { session }
    })
  }

  return (
    <ButtonTooltip className="p-1.5 hover:bg-transparent/10 dark:hover:bg-transparent/30"
      variant="ghost"
      size="icon"
      onClick={handleToggleSort}
      tooltip={(
        <div className="flex items-center gap-x-1.5">
          <SortAsc className={cn("size-3.5 flex-none", { "hidden": sort.startedAt === 'desc' })} />
          <SortDesc className={cn("size-3.5 flex-none", { "hidden": sort.startedAt === 'asc' })} />

          <p className="font-light dark:font-extralight">
            Sort by <span className={cn("text-destructive font-medium", { "text-accent": sort.startedAt === 'desc' })}>
              {sort.startedAt === 'desc' ? 'recently' : 'previously'}
            </span> played
          </p>
        </div>
      )}
    >
      <SortAsc className={cn("size-4 sm:size-[1.125rem] flex-none transition-all", {
        "rotate-0 scale-100": sort.startedAt === 'asc',
        "-rotate-90 scale-0": sort.startedAt === 'desc'
      })} />

      <SortDesc className={cn("absolute size-4 sm:size-[1.125rem] flex-none transition-all", {
        "rotate-90 scale-0": sort.startedAt === 'asc',
        "rotate-0 scale-100": sort.startedAt === 'desc'
      })} />
    </ButtonTooltip>
  )
}

export default SessionSort