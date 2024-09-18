"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { toast } from "sonner"

// constants
import { offlineSessionMetadata } from "@/constants/game"

// components
import { SessionStats } from "@/components/session"

// hooks
import { useGameStore } from "@/hooks/use-game-store"

const OfflineSessionResults = () => {
  const router = useRouter()
  const session = useGameStore((state) => state.session)

  const isOver = session?.cards.every((card) => card.isFlipped && card.isMatched)

  useEffect(() => {
    if (!session || !isOver) {
      router.replace('/game/setup')
      toast.warning("Offline session not found.", {
        description: "Sorry, but we couldn't find any offline sessions ready to be saved.",
        /**
         * Note: for a reason, this toast would render twice,
         * so it is prevented by adding a custom id.
         */
        id: '_'
      })
    }
  }, [router, session, isOver])

  return session && isOver ? (
    <SessionStats
      session={{
        ...session,
        ...offlineSessionMetadata
      }}
      withTitle
    />
  ) : null
}

export default OfflineSessionResults
