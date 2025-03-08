"use client"

// helpers
import { validateCardMatches } from "@/lib/helper/session-helper"

// utils
import { logError } from "@/lib/util/error"

// components
import { MemoryTable, SessionFooter, SessionHeader } from "@/components/gameplay"

// hooks
import { useSessionStore } from "@/components/provider/session-store-provider"
import { useSingleplayerGameHandler } from "@/hooks/handler/use-singleplayer-game-handler"
import { useFinishSessionAction, useStoreSessionAction } from "@/lib/safe-action/session"

const SingleGameHandler = () => {
  const session = useSessionStore((state) => state.session)
  const setStoreState = useSessionStore((state) => state.setState)

  const { executeAsync: executeFinishSession } = useFinishSessionAction()
  const { executeAsync: executeStoreSession } = useStoreSessionAction()

  const { handleCardFlip } = useSingleplayerGameHandler({
    async onHeartbeat() {
      try {
        await executeStoreSession(session)
      } catch (err) {
        logError(err)
      }
    },

    async onFinish() {
      setStoreState({ syncStatus: "synchronized" })

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
      <SessionHeader />

      <MemoryTable
        handleCardFlip={handleCardFlip}
      />

      <SessionFooter />
    </>
  )
}

export default SingleGameHandler
