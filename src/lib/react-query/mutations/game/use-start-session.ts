import { useRouter } from "next/navigation"

import { toast } from "sonner"

// trpc
import { api } from "@/trpc/client"

// types
import type { UseFormReturn } from "react-hook-form"
import type { SetupGameFormValues } from "@/components/form/setup-game-form"
import type { SessionRunningWarningActions } from "@/app/game/setup/@warning/warning/session-warning-modal"

// utils
import { handleApiError } from "@/lib/utils"
import { parseSchemaToClientSession } from "@/lib/utils/game"

// hooks
import { useSessionStore } from "@/hooks/store/use-session-store"
import { useCacheStore, type CacheStore } from "@/hooks/store/use-cache-store"

export const useStartSessionMutation = () => {
  const router = useRouter()

  const registerSession = useSessionStore((state) => state.register)

  const setCache = useCacheStore<
    SessionRunningWarningActions,
    CacheStore<SessionRunningWarningActions>['set']
  >((state) => state.set)
  const clearCache = useCacheStore((state) => state.clear)

  const startSession = api.game.create.useMutation({
    onSuccess: (session) => {
      clearCache()

      const clientSession = parseSchemaToClientSession({ ...session, result: null })
      registerSession(clientSession)
      router.replace('/game')

      const { type, mode, tableSize } = session
      toast.success('Game started!', {
        description: `${type} | ${mode} | ${tableSize}`
      })
    },
    onError: (err) => {
      if (err.shape?.cause.key === 'ACTIVE_SESSION') {
        router.replace('/game/setup/warning', { scroll: false })
        return
      }

      clearCache()
      handleApiError(err.shape?.cause, 'Failed to start game session. Please try again later.')
    }
  })

  const onSubmit = async (form: UseFormReturn<SetupGameFormValues>, forceStart: boolean = false) => {
    const values = form.getValues()

    // TODO: implement
    if (values.type === 'COMPETITIVE' || values.mode !== 'SINGLE') {
      toast.warning('Work in progress', {
        description: "Sorry, but the configuration contains values that are not implemented yet. Please come back later, or select another game type or mode to play."
      })
      return
    }

    /**
     * Caching warning actions here because inside the 'onSuccess'
     * and 'onError' methods, we cannot access form.
     */
    if (!forceStart) {
      setCache({
        forceStart: () => onSubmit(form, true),
        continuePrevious: () => {
          // TODO: implement
          // - get session -> show warning toast if session not found
          // - register session -> show info toast (session continued)
          // - redirect to /game
        }
      })
    }

    // TODO: implement mutation
    // if (forceStart) await abandonSession.mutateAsync()
    await startSession.mutateAsync(values)
    form.reset()
  }

  return { startSession, onSubmit }
}
