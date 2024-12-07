import { useAction } from "next-safe-action/hooks"

// actions
import { storeSession } from "@/server/actions/session-action"

// utils
import { handleServerError } from "@/lib/utils/error"

// hooks
import { useSessionStore } from "@/components/providers/session-store-provider"
import { useFinishSessionAction } from "./use-finish-session"

export const useStoreSessionAction = () => {
  const updateSyncState = useSessionStore((state) => state.updateSyncState)

  const { status: finishSessionStatus } = useFinishSessionAction()

  return useAction(storeSession, {
    onExecute: () => updateSyncState("PENDING"),
    onSuccess: () => updateSyncState("SYNCHRONIZED"),
    onError: ({ error }) => {
      if (
        error.serverError?.key === 'SESSION_NOT_FOUND' &&
        finishSessionStatus === 'executing'
      ) return
  
      updateSyncState("OUT_OF_SYNC")
      handleServerError(error.serverError)
    }
  })
}
