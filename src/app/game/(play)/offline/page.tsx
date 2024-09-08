"use client"

import { redirect } from "next/navigation"

// clerk
import { useClerk } from "@clerk/nextjs"

// components
import { TablePlayground } from "@/components/game"

// hooks
import { useGameStore } from "@/hooks/use-game-store"

const GamePlayOfflinePage = () => {
  const { user } = useClerk()

  const clientSession = useGameStore((state) => state.session)

  if (user || !clientSession) {
    redirect('/game/setup')
  }

  return <TablePlayground session={clientSession} />
}

export default GamePlayOfflinePage
