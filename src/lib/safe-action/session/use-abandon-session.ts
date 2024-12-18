import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

// actions
import { abandonSession } from "@/server/action/session-action"

// utils
import { handleServerError } from "@/lib/util/error"

export const useAbandonSessionAction = () => useAction(abandonSession, {
  onSuccess() {
    toast.warning('Session has been abandoned.', {
      description: 'Session is saved, but it cannot be continued.'
    })
  },
  onError({ error }) {
    handleServerError(error.serverError, 'Failed to abandon session. Please try again.')
  }
})
