"use client"

import dynamic from "next/dynamic"
import { redirect } from "next/navigation"

const MemoryTable = dynamic(() => import("@/components/session/game/memory-table"), { ssr: false })

// hooks
import { useGameStore } from "@/hooks/use-game-store"

const InitializeOfflineGame = () => {
  const clientSession = useGameStore((state) => state.session)
  if (!clientSession) redirect('/game/setup')

  const updateCards = useGameStore((state) => state.updateCards)

  return (
    <MemoryTable
      session={clientSession}
      updateCards={updateCards}
    />
  )
}

export default InitializeOfflineGame
