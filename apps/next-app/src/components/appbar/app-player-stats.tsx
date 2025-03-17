"use client"

import { useMemo } from "react"

// types
import type { ClientPlayer } from "@repo/schema/player"

// utils
import { getRendererPlayerStats } from "@/lib/util/stats"
import { cn } from "@/lib/util"

// icons
import { ChevronRightCircle } from "lucide-react"

// shadcn
import { Skeleton } from "@/components/ui/skeleton"

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
    "elo", "sessions", "totalTime", "avgTime", "flips", "matches"
  ]), [activePlayer])

  return (
    <div className={cn("h-12 flex flex-wrap items-center gap-x-2 gap-y-6 overflow-y-hidden lg:justify-end", {
      "justify-end": state === "collapsed" && !isMobile
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

const AppPlayerStatsSkeleton = () => {
  const { state, isMobile } = useSidebar()

  return (
    <div className={cn("h-12 flex flex-wrap items-center gap-x-2 gap-y-6 overflow-y-hidden lg:justify-end", {
      "justify-end": state === "collapsed" && !isMobile
    })}>
      <div className="h-full" />

      {Array(isMobile ? 1 : 6).fill("").map((_, index) => (
        <Skeleton className="w-20 h-5 rounded-full bg-muted-foreground/25"
          key={index}
        />
      ))}
    </div>
  )
}

export default AppPlayerStats
export { AppPlayerStatsSkeleton }
