"use client"

import { redirect } from "next/navigation"

import { toast } from "sonner"

// constants
import { offlineSessionMetadata } from "@/constants/game"

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
      /**
       * Note: for a reason, this toast would render twice,
       * so it is prevented by adding a custom id.
       */
      id: '_'
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
