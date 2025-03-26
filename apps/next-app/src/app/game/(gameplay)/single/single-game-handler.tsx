"use client"

// types
import type { FinishSoloSessionValidation } from "@repo/schema/session-validation"

// utils
import { logError } from "@/lib/util/error"

// components
import { MemoryTable, SessionFooter, SessionHeader } from "@/components/gameplay"

// hooks
import { useSessionStore } from "@/components/provider/session-store-provider"
import { useSingleplayerGameHandler } from "@/hooks/handler/use-singleplayer-game-handler"
import {
  useFinishSoloSessionAction,
  useStoreSoloSessionAction
} from "@/lib/safe-action/session/singleplayer"

const SingleGameHandler = () => {
  const session = useSessionStore((state) => state.session)
  const setStoreState = useSessionStore((state) => state.setState)

  const { executeAsync: storeSoloSession } = useStoreSoloSessionAction()
  const { executeAsync: finishSoloSession } = useFinishSoloSessionAction()

  const { handleCardFlip } = useSingleplayerGameHandler({
    async onHeartbeat() {
      try {
        await storeSoloSession(session)
      } catch (err) {
        logError(err)
      }
    },

    async onFinish() {
      setStoreState({ syncStatus: "synchronized" })

      try {
        await finishSoloSession(session as FinishSoloSessionValidation)
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
