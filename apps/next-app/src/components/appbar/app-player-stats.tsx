"use client"

import { useMemo } from "react"

// types
import type { ClientPlayer } from "@/lib/types/client"

// utils
import { getRendererPlayerStats } from "@/lib/util/stats"
import { cn } from "@/lib/util"

// icons
import { ChevronRightCircle } from "lucide-react"

// components
import { StatisticBadge } from "@/components/shared"
import { PlayerBadge } from "@/components/player"

// hooks
import { useSidebar } from "@/components/ui/sidebar"

type AppPlayerStatsProps = {
  activePlayer: ClientPlayer
}

const AppPlayerStats = ({ activePlayer }: AppPlayerStatsProps) => {
  const { state, isMobile } = useSidebar()

  const stats = useMemo(() => getRendererPlayerStats(activePlayer, [
    'score', 'sessions', 'timer', 'flips', 'matches'
  ]), [activePlayer])

  return (
    <div className={cn("h-12 flex flex-wrap items-center gap-x-2 gap-y-6 overflow-y-hidden lg:justify-end", {
      "justify-end": state === 'collapsed' && !isMobile
    })}>
      <div className="h-full flex items-center gap-x-2">
        <PlayerBadge player={activePlayer} />
        <ChevronRightCircle className="hidden size-3.5 -mx-0.5 shrink-0 text-muted-foreground/85 md:flex" />
      </div>

      {Object.values(stats).map((stat) => (
        <StatisticBadge className="hidden flex-wrap md:flex"
          statistic={stat}
          key={stat.key}
        />
      ))}
    </div>
  )
}

export default AppPlayerStats
