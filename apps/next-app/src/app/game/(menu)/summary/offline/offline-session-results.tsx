"use client"

import { useMemo } from "react"
import { redirect } from "next/navigation"

import { toast } from "sonner"

// config
import { offlineSessionMetadata } from "@/config/session-settings"

// utils
import { getSessionFromStorage } from "@/lib/util/storage"
import { getRendererSessionStats } from "@/lib/util/stats"

// components
import { StatisticItem, StatisticList } from "@/components/shared"

const OfflineSessionResults = () => {
  const session = getSessionFromStorage()
  const isOver = session?.cards.every((card) => !!card.matchedBy)

  if (!session || !isOver) {
    toast.warning("Offline session not found.", {
      description: "Sorry, but we couldn't find any offline sessions ready to be saved.",
      id: '_' /** Note: prevent re-render by adding a custom id. */
    })
    redirect('/game/setup')
  }

  const stats = useMemo(() => getRendererSessionStats({
    ...session,
    ...offlineSessionMetadata
  }, ['tableSize', 'timer', 'matches', 'flips', 'startedAt']), [session])

  return (
    <StatisticList className="px-2 max-w-4xl">
      {Object.values(stats).map((stat) => (
        <StatisticItem className="min-w-36 max-w-52 sm:min-w-52"
          size="sm"
          statistic={stat}
          key={stat.key}
        />
      ))}
    </StatisticList>
  )
}

export default OfflineSessionResults
