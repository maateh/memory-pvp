import { useRouter } from "next/navigation"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

// types
import type { CreateSingleSessionValidation } from "@repo/schema/session-validation"
import type { SessionFormValuesCache } from "@/components/session/form/session-form"

// actions
import { createSingleSession } from "@/server/action/session-action"

// utils
import { handleServerError } from "@/lib/util/error"

// hooks
import { useCacheStore } from "@/hooks/store/use-cache-store"

export const useCreateSingleSessionAction = () => {
  const router = useRouter()
  const setCache = useCacheStore<SessionFormValuesCache<CreateSingleSessionValidation>, 'set'>((state) => state.set)

  return useAction(createSingleSession, {
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
