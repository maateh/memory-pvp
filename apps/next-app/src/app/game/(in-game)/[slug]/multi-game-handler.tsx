"use client"

// components
import { MemoryTable } from "@/components/session/ingame"

// hooks
import { useMultiSessionStore } from "@/components/provider/multi-session-store-provider"

const MultiGameHandler = () => {
  const session = useMultiSessionStore((state) => state.session)

  return (
    <MemoryTable
      session={session}
      handleCardFlip={() => {}}
    />
  )
}

export default MultiGameHandler
