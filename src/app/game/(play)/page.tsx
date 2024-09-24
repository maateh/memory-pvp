"use client"

// components
import { SessionFooter, SessionHeader } from "@/components/session"
import { MemoryTable } from "@/components/session/game"

// hooks
import { useGameHandler } from "@/hooks/handler/game/use-game-handler"

const GamePlayPage = () => {
  const { clientSession, handleCardFlip } = useGameHandler({
    finishSession: () => {
      // TODO: implement
    }
  })

  return (
    <>
      <SessionHeader session={clientSession} />

      <MemoryTable
        session={clientSession}
        handleCardFlip={handleCardFlip} // TODO: implement
      />

      <SessionFooter session={clientSession} />
    </>
  )
}

export default GamePlayPage
