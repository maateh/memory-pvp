import { useRouter } from "next/navigation"
import { toast } from "sonner"

// trpc
import { api } from "@/trpc/client"

// types
import type { UseFormReturn } from "react-hook-form"
import type { SetupGameFormValues } from "@/app/game/(base)/setup/setup-game-form"
import type { SessionRunningWarningActions } from "@/app/game/(base)/setup/@warning/warning/session-warning-modal"

// utils
import { logError, handleApiError } from "@/lib/utils"

// hooks
import { useSessionStore } from "@/hooks/store/use-session-store"
import { useCacheStore } from "@/hooks/store/use-cache-store"

type UseStartSingleSessionMutationParams = {
  form: UseFormReturn<SetupGameFormValues>
}

export const useStartSingleSessionMutation = ({ form }: UseStartSingleSessionMutationParams) => {
  const router = useRouter()

  const registerSession = useSessionStore((state) => state.register)
  const setCache = useCacheStore<SessionRunningWarningActions, 'set'>((state) => state.set)

  const startSession = api.session.create.useMutation({
    onSuccess: (session) => {
      registerSession(session)
      router.replace('/game/single')

      const { type, mode, tableSize } = session
      toast.success('Game started!', {
        description: `${type} | ${mode} | ${tableSize}`
      })
    },
    onError: (err) => {
      if (err.shape?.cause.key === 'ACTIVE_SESSION') {
        setCache({
          forceStart: () => handleStartSingleSession(form.getValues(), true),
          continuePrevious: () => {
            const clientSession = err.shape?.cause.data as ClientGameSession

            if (!clientSession) {
              toast.warning("Active session not found.", {
                description: "Sorry, but we couldn't load your previous session data. Please start a new game instead."
              })
              return
            }

            registerSession({
              ...clientSession,
              continuedAt: new Date()
            })
            router.replace('/game/single')

            toast.info('Game session continued!', {
              description: `${clientSession.type} | ${clientSession.mode} | ${clientSession.tableSize}`
            })
          }
        })

        router.replace('/game/setup/warning', { scroll: false })
        return
      }

      handleApiError(err.shape?.cause, 'Failed to start game session. Please try again later.')
    }
  })

  const abandonSession = api.session.abandon.useMutation({
    onSuccess: () => {
      toast.warning('Your previous session has been abandoned.', {
        description: 'Session has also been saved, but from now on it cannot continue.'
      })
    },
    onError: (err) => {
      handleApiError(err.shape?.cause, 'Failed to abandon session. Please try again.')
    }
  })

  const handleStartSingleSession = async (values: SetupGameFormValues, forceStart: boolean = false) => {
    try {
      if (forceStart) await abandonSession.mutateAsync()
      await startSession.mutateAsync(values)

      form.reset()
    } catch (err) {
      logError(err)
    }
  }

  return { startSession, handleStartSingleSession }
}
