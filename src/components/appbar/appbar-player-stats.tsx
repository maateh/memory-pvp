"use client"

import { useMemo } from "react"

// utils
import { getPlayerStatsMap } from "@/lib/utils/stats"
import { cn } from "@/lib/utils"

// icons
import { ChevronRightCircle } from "lucide-react"

// components
import { StatisticBadge } from "@/components/shared"
import { PlayerBadge } from "@/components/player"

// hooks
import { useSidebar } from "@/components/ui/sidebar"

type NavbarPlayerStatsProps = {
  activePlayer: ClientPlayer
}

const NavbarPlayerStats = ({ activePlayer }: NavbarPlayerStatsProps) => {
  const { state, isMobile } = useSidebar()

  const stats = useMemo(() => getPlayerStatsMap(activePlayer, [
    'score', 'sessions', 'timer', 'flips', 'matches'
  ]), [activePlayer])

  return (
    <div className={cn("h-12 flex flex-wrap items-center gap-x-2 gap-y-6 overflow-y-hidden", {
      "justify-end": state === 'collapsed' || isMobile
    })}>
      <div className="h-full flex items-center gap-x-2">
        <PlayerBadge player={activePlayer} />
        <ChevronRightCircle className="hidden size-4 shrink-0 text-muted-foreground/85 sm:block" />
      </div>

      {Object.values(stats).map(({ key, data, Icon }) => (
        <StatisticBadge className="hidden sm:flex"
          Icon={Icon}
          stat={data}
          key={key}
        />
      ))}
    </div>
  )
}

export default NavbarPlayerStats
