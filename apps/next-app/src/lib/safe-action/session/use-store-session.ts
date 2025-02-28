import { useAction } from "next-safe-action/hooks"

// actions
import { storeSession } from "@/server/action/session-action"

// utils
import { handleServerError } from "@/lib/util/error"

// hooks
import { useFinishSessionAction } from "./use-finish-session"

export const useStoreSessionAction = () => {
  const { status: finishSessionStatus } = useFinishSessionAction()

  return useAction(storeSession, {
    onError: ({ error }) => {
      if (
        error.serverError?.key === "SESSION_NOT_FOUND" &&
        finishSessionStatus === "executing"
      ) return
  
      handleServerError(error.serverError)
    }
  })
}
