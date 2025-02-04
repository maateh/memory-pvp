"use client"

// components
import { MemoryTable } from "@/components/session/ingame"

// hooks
import { useSessionEvents } from "@/components/provider/session-event-provider"

const MultiGameHandler = () => {
  const { session } = useSessionEvents()

  return (
    <MemoryTable
      session={session}
      handleCardFlip={() => {}}
    />
  )
}

export default MultiGameHandler
