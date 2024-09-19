"use client"

// constants
import { offlineSessionMetadata } from "@/constants/game"

// components
import { SessionHeader } from "@/components/session"
import { MemoryTable } from "@/components/session/game"

// hooks
import { useOfflineGameHandler } from "@/hooks/handler/game/use-offline-game-handler"

const OfflineGameHandler = () => {
  const { clientSession, cards, handleCardFlip } = useOfflineGameHandler()

  return (
    <>
      <SessionHeader
        session={{
          ...clientSession,
          ...offlineSessionMetadata
        }}
      />

      <MemoryTable
        session={{
          ...clientSession,
          ...offlineSessionMetadata,
          cards
        }}
        handleCardFlip={handleCardFlip}
      />
    </>
  )
}

export default OfflineGameHandler
