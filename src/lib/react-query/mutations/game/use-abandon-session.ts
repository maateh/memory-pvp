import { toast } from "sonner"

// trpc
import { api } from "@/trpc/client"

// utils
import { handleApiError, logError } from "@/lib/utils"

// hooks
import { useSessionStore } from "@/hooks/store/use-session-store"

export const useAbandonSessionMutation = () => {
  const unregisterSession = useSessionStore((state) => state.unregister)

  const abandonSession = api.session.save.useMutation({
    onSuccess: () => {
      unregisterSession()

      toast.info('Your session has been abandoned.', {
        description: 'Session has also been saved, but from now on it cannot continue.'
      })
    },
    onError: (err) => {
      handleApiError(err.shape?.cause, 'Failed to abandon and save your session.')
    }
  })

  const handleAbandonSession = async (clientSession: ClientGameSession) => {
    try {
      await abandonSession.mutateAsync({
        ...clientSession,
        status: 'ABANDONED'
      })
    } catch (err) {
      logError(err)
    }
  }

  return { abandonSession, handleAbandonSession }
}
