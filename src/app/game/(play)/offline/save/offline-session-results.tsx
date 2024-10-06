"use client"

import { redirect } from "next/navigation"

import { toast } from "sonner"

// constants
import { offlineSessionMetadata } from "@/constants/session"

// utils
import { getSessionFromStorage } from "@/lib/utils/storage"

// components
import { SessionStats } from "@/components/session"

const OfflineSessionResults = () => {
  const session = getSessionFromStorage()
  const isOver = session?.cards.every((card) => card.isFlipped && card.isMatched)

  if (!session || !isOver) {
    toast.warning("Offline session not found.", {
      description: "Sorry, but we couldn't find any offline sessions ready to be saved.",
      id: '_' /** Note: prevent re-render by adding a custom id. */
    })
    redirect('/game/setup')
  }

  return (
    <SessionStats
      session={{
        ...session,
        ...offlineSessionMetadata
      }}
      withTitle
    />
  )
}

export default OfflineSessionResults
