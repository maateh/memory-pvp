"use client"

import { useEffect, useState } from "react"
import { redirect } from "next/navigation"

// components
import { TablePlayground } from "@/components/game"

// hooks
import { useGameStore } from "@/hooks/use-game-store"

const GamePlayOfflinePage = () => {
  /** Note: prevent SSR */
  const [mounted, setMounted] = useState(false)

  const clientSession = useGameStore((state) => state.get)()
  if (!clientSession && mounted) redirect('/game/setup')

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted && <TablePlayground session={clientSession!} />
}

export default GamePlayOfflinePage
