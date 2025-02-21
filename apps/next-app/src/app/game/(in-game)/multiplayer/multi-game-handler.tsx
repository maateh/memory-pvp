"use client"

// components
import { MemoryTable, SessionFooter, SessionHeader } from "@/components/session/ingame"

// hooks
import { useMultiSessionStore } from "@/components/provider/multi-session-store-provider"

const MultiGameHandler = () => {
  const session = useMultiSessionStore((state) => state.session)

  return (
    <>
      <SessionHeader session={session} />

      <MemoryTable
        session={session}
        handleCardFlip={() => {}}
      />

      <SessionFooter session={session} />
    </>
  )
}

export default MultiGameHandler
