import { useRouter } from "next/navigation"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

// types
import type { SessionFormValuesCache } from "@/components/session/form/session-form"

// actions
import { createSession } from "@/server/actions/session-action"

// utils
import { handleServerError } from "@/lib/utils/error"

// hooks
import { useCacheStore } from "@/hooks/store/use-cache-store"

export const useCreateSessionAction = () => {
  const router = useRouter()
  const setCache = useCacheStore<SessionFormValuesCache, 'set'>((state) => state.set)

  return useAction(createSession, {
    onSuccess({ input: { type, mode, tableSize, forceStart } }) {
      if (forceStart) {
        toast.warning('Previous session has been abandoned.', {
          description: 'Session is saved, but cannot be continued.'
        })
      }

      toast.success('Game session started!', {
        description: `${type} | ${mode} | ${tableSize}`
      })
    },
    onError({ error, input: sessionValues }) {
      if (error.serverError?.key === 'ACTIVE_SESSION') {
        setCache({ sessionValues, collection: null })
        router.push('/game/setup/warning')
        return
      }

      handleServerError(error.serverError, 'Failed to start game session. Please try again later.')
    }
  })
}
