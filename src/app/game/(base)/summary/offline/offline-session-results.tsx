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
import { SessionStatistics } from "@/components/session/summary"

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
  }, ['tableSize', 'timer', 'matches', 'flips', 'startedAt']), [session])

  return (
    <SessionStatistics
      stats={stats}
    />
  )
}

export default OfflineSessionResults
