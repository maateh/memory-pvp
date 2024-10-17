"use client"

import { useMemo } from "react"
import { redirect } from "next/navigation"

import { toast } from "sonner"

// constants
import { offlineSessionMetadata } from "@/constants/session"

// utils
import { getSessionFromStorage } from "@/lib/utils/storage"
import { getSessionStatsMap } from "@/lib/utils/stats"

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

  const stats = useMemo(() => getSessionStatsMap({
    ...session,
    ...offlineSessionMetadata
  }), [])

  return (
    <>
      <h3 className="mb-3 text-foreground/85 text-2xl text-center font-heading font-medium underline underline-offset-8 decoration-1 sm:text-3xl">
        Session Statistics
      </h3>

      <StatisticList className="px-2 max-w-4xl">
        {Object.values(stats).map((stat) => (
          <StatisticItem className="min-w-40 max-w-60 sm:min-w-60"
            statistic={stat}
            key={stat.key}
          />
        ))}
      </StatisticList>
    </>
  )
}

export default OfflineSessionResults