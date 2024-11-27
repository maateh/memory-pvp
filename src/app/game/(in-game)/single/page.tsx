"use client"

// helpers
import { validateCardMatches } from "@/lib/helpers/session"

// utils
import { logError } from "@/lib/utils"

// components
import { MemoryTable, SessionFooter, SessionHeader, SessionLoader } from "@/components/session/ingame"

// hooks
import { useGameHandler } from "@/hooks/handler/game/use-game-handler"
import { useFinishSessionAction, useStoreSessionAction } from "@/lib/safe-action/session"

const InGameSinglePage = () => {
  const { executeAsync: executeFinishSession } = useFinishSessionAction()
  const { executeAsync: executeStoreSession } = useStoreSessionAction()

  const { clientSession, handleCardFlip } = useGameHandler({
    onHeartbeat: async () => {
      try {
        await executeStoreSession(clientSession!)
      } catch (err) {
        logError(err)
      }
    },
    onBeforeUnload: async () => {
      const payload = JSON.stringify(clientSession)
      navigator.sendBeacon('/api/session/closed', payload)
    },
    onFinish: async () => {
      try {
        await executeFinishSession({
          ...clientSession!,
          cards: validateCardMatches(clientSession!.cards)
        })
      } catch (err) {
        logError(err)
      }
    }
  })

  if (!clientSession) {
    return <SessionLoader />
  }

  return (
    <>
      <SessionHeader session={clientSession} />

      <MemoryTable
        session={clientSession}
        handleCardFlip={handleCardFlip}
      />

      <SessionFooter session={clientSession} />
    </>
  )
}

export default InGameSinglePage
