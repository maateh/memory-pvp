"use client"

// helpers
import { validateCardMatches } from "@/lib/helper/session-helper"

// utils
import { logError } from "@/lib/util/error"

// components
import { MemoryTable, SessionFooter, SessionHeader } from "@/components/session/ingame"

// hooks
import { useSessionStore } from "@/components/provider/session-store-provider"
import { useSingleGameHandler } from "@/hooks/handler/game/use-single-game-handler"
import { useFinishSessionAction, useStoreSessionAction } from "@/lib/safe-action/session"

const SingleGameHandler = () => {
  const session = useSessionStore((state) => state.session)

  const { executeAsync: executeFinishSession } = useFinishSessionAction()
  const { executeAsync: executeStoreSession } = useStoreSessionAction()

  const { handleCardFlip } = useSingleGameHandler({
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
          clientSession: {
            ...session,
            cards: validateCardMatches(session.cards)
          }
        })
      } catch (err) {
        logError(err)
      }
    }
  })

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

export default SingleGameHandler
