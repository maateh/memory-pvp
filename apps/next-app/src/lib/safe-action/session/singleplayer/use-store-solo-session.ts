import { useAction } from "next-safe-action/hooks"

// actions
import { storeSoloSession } from "@/server/action/session/singleplayer-action"

// utils
import { handleServerError } from "@/lib/util/error"

// hooks
import { useSessionStore } from "@/components/provider/session-store-provider"
import { useFinishSoloSessionAction } from "./use-finish-solo-session"

export const useStoreSoloSessionAction = () => {
  const setStoreState = useSessionStore((state) => state.setState)

  const { status: finishSoloSessionStatus } = useFinishSoloSessionAction()

  return useAction(storeSoloSession, {
    onExecute() {
      setStoreState({ syncStatus: "synchronizing" })
    },
    onSuccess() {
      setStoreState({ syncStatus: "synchronized" })
    },
    onError: ({ error }) => {
      if (
        error.serverError?.key === "SESSION_NOT_FOUND" &&
        finishSoloSessionStatus === "executing"
      ) return

      setStoreState({ syncStatus: "out_of_sync" })
      handleServerError(error.serverError)
    }
  })
}
