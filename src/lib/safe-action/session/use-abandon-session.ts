import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

// actions
import { abandonSession } from "@/server/actions/session"

// utils
import { handleActionError } from "@/lib/utils"

// hooks
import { useSessionStore } from "@/hooks/store/use-session-store"

type UseAbandonSessionActionParams = {
  previous?: boolean
}

export const useAbandonSessionAction = ({ previous = false }: UseAbandonSessionActionParams = {}) => {
  const unregisterSession = useSessionStore((state) => state.unregister)

  return useAction(abandonSession, {
    onSuccess() {
      unregisterSession()

      const message = previous
        ? 'Previous session has been abandoned.'
        : 'Session has been abandoned.'

      toast.warning(message, {
        description: 'Session is saved, but it cannot be continued.'
      })
    },
    onError({ error }) {
      handleActionError(error.serverError, 'Failed to abandon session. Please try again.')
    }
  })
}
