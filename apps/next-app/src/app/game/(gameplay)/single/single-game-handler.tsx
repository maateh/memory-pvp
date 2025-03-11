"use client"

// types
import type { SoloClientSession } from "@repo/schema/session"

// helpers
import { validateCardMatches } from "@/lib/helper/session-helper"

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

  const { executeAsync: finishSoloSession } = useFinishSoloSessionAction()
  const { executeAsync: storeSoloSession } = useStoreSoloSessionAction()

  const { handleCardFlip } = useSingleplayerGameHandler({
    async onHeartbeat() {
      try {
        await storeSoloSession({
          clientSession: session as SoloClientSession
        })
      } catch (err) {
        logError(err)
      }
    },

    async onFinish() {
      setStoreState({ syncStatus: "synchronized" })

      try {
        await finishSoloSession({
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
