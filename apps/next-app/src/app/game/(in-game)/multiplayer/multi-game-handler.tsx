"use client"

// components
import { MemoryTable, SessionFooter, SessionHeader } from "@/components/session/ingame"

// hooks
import { useSessionStore } from "@/components/provider/session-store-provider"
import { useMultiGameHandler } from "@/hooks/handler/game/use-multi-game-handler"

const MultiGameHandler = () => {
  const session = useSessionStore((state) => state.session)

  const { handleCardFlip } = useMultiGameHandler()

  return (
    <>
      <SessionHeader session={session} />

      <MemoryTable
        session={session}
        handleCardFlip={handleCardFlip}
      />

      <SessionFooter session={session} />
    </>
  )
}

export default MultiGameHandler
