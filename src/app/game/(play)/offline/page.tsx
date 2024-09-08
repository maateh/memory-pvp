"use client"

import { useRouter } from "next/navigation"

// clerk
import { useClerk } from "@clerk/nextjs"

// components
import { TablePlayground } from "@/components/game"

// hooks
import { useGameStore } from "@/hooks/use-game-store"

const GamePlayOfflinePage = () => {
  const router = useRouter()
  const { user } = useClerk()

  const clientSession = useGameStore((state) => state.session)

  if (user || !clientSession) {
    // TODO: a not-found page might be better (?)
    router.replace('/game/setup')
    return
  }

  return <TablePlayground session={clientSession} />
}

export default GamePlayOfflinePage
