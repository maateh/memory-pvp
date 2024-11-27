import { useAction } from "next-safe-action/hooks"

// actions
import { storeSession } from "@/server/actions/session"

// utils
import { handleActionError } from "@/lib/utils"

// hooks
import { useSessionStore } from "@/hooks/store/use-session-store"
import { useFinishSessionAction } from "./use-finish-session"

export const useStoreSessionAction = () => {
  const { status: finishSessionStatus } = useFinishSessionAction()

  return useAction(storeSession, {
    onExecute: () => useSessionStore.setState({ syncState: "PENDING" }),
    onSuccess: () => useSessionStore.setState({ syncState: "SYNCHRONIZED" }),
    onError: ({ error }) => {
      if (
        error.serverError?.key === 'SESSION_NOT_FOUND' &&
        finishSessionStatus === 'executing'
      ) return
  
      useSessionStore.setState({ syncState: "OUT_OF_SYNC" })
      handleActionError(error.serverError)
    }
  })
}
