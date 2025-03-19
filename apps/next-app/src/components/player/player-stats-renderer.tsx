"use client"

import { useMemo } from "react"

// types
import type { ClientPlayer } from "@repo/schema/player"
import type { SessionFilter } from "@repo/schema/session"

// trpc
import { trpc } from "@/server/trpc/client"

// utils
import { cn } from "@/lib/util"
import { getRendererPlayerStats } from "@/lib/util/stats"

// shadcn
import { Skeleton } from "@/components/ui/skeleton"

// components
import { StatisticBadge } from "@/components/shared"

// hooks
import { useFilterStore } from "@/hooks/store/use-filter-store"

type PlayerStatsRendererProps = {
  player: ClientPlayer
}

const PlayerStatsRenderer = ({ player }: PlayerStatsRendererProps) => {
  const filter = useFilterStore<SessionFilter>((state) => state.statistics)

  const [stats] = trpc.player.getStats.useSuspenseQuery({
    filter: { ...filter, playerId: player.id }
  })

  const playerStats = useMemo(() => getRendererPlayerStats({
    ...player,
    stats
  }, ["elo", "sessions", "timer", "flips", "matches"]), [player, stats])

  return (
    <ul className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
      {Object.values(playerStats).map((stat) => (
        <li key={stat.key}>
          <StatisticBadge className="px-1.5 dark:font-light bg-muted/50 text-foreground/80 hover:bg-muted/65 hover:text-foreground/90 rounded-xl"
            statistic={stat}
          />
        </li>
      ))}
    </ul>
  )
}

const PlayerStatsRendererSkeleton = ({ length = 5, className, ...props }: {
  length?: number
} & React.ComponentProps<"ul">) => (
  <ul className={cn("flex flex-wrap items-center gap-x-1.5 gap-y-0.5", className)} {...props}>
    {Array.from({ length }).fill('').map((_, index) => (
      <li key={index}>
        <Skeleton className="h-6 w-20 bg-muted/80 rounded-xl" />
      </li>
    ))}
  </ul>
)

export default PlayerStatsRenderer
export { PlayerStatsRendererSkeleton }
