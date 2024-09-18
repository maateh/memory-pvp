"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { toast } from "sonner"

// hooks
import { useGameStore } from "@/hooks/use-game-store"

const CheckOfflineSession = () => {
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

  return null
}

export default CheckOfflineSession
