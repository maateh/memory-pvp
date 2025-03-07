import { useAction } from "next-safe-action/hooks"

// actions
import { storeSession } from "@/server/action/session-action"

// utils
import { handleServerError } from "@/lib/util/error"

// hooks
import { useFinishSessionAction } from "./use-finish-session"
import { useSessionStore } from "@/components/provider/session-store-provider"

export const useStoreSessionAction = () => {
  const setStoreState = useSessionStore((state) => state.setState)

  const { status: finishSessionStatus } = useFinishSessionAction()

  return useAction(storeSession, {
    onExecute() { setStoreState({ syncStatus: "synchronizing" }) },
    onSuccess() { setStoreState({ syncStatus: "synchronized" }) },
    onError: ({ error }) => {
      if (
        error.serverError?.key === "SESSION_NOT_FOUND" &&
        finishSessionStatus === "executing"
      ) return
  
      setStoreState({ syncStatus: "out_of_sync" })
      handleServerError(error.serverError)
    }
  })
}
