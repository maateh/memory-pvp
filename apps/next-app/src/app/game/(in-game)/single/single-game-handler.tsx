"use client"

// helpers
import { validateCardMatches } from "@/lib/helper/session-helper"

// utils
import { logError } from "@/lib/util/error"

// components
import { MemoryTable } from "@/components/session/ingame"

// hooks
import { useSingleSessionStore } from "@/components/provider/single-session-store-provider"
import { useGameHandler } from "@/hooks/handler/game/use-game-handler"
import { useFinishSessionAction, useStoreSessionAction } from "@/lib/safe-action/session"

const SingleGameHandler = () => {
  const session = useSingleSessionStore((state) => state.session)

  const { executeAsync: executeFinishSession } = useFinishSessionAction()
  const { executeAsync: executeStoreSession } = useStoreSessionAction()

  const { handleCardFlip } = useGameHandler({
    onHeartbeat: async () => {
      try {
        await executeStoreSession(session)
      } catch (err) {
        logError(err)
      }
    },
    onBeforeUnload: async () => {
      const payload = JSON.stringify(session)
      navigator.sendBeacon('/api/session/closed', payload)
    },
    onFinish: async () => {
      try {
        await executeFinishSession({
          ...session,
          cards: validateCardMatches(session.cards)
        })
      } catch (err) {
        logError(err)
      }
    }
  })

  return (
    <MemoryTable
      session={session}
      handleCardFlip={handleCardFlip}
    />
  )
}

export default SingleGameHandler
