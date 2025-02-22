import { useRouter } from "next/navigation"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

// types
import type { GameMode } from "@repo/db"
import type { SessionFormValuesCache } from "@/components/session/form/session-form"

// actions
import { createSingleSession } from "@/server/action/session-action"

// utils
import { handleServerError } from "@/lib/util/error"

// hooks
import { useCacheStore } from "@/hooks/store/use-cache-store"

export const useCreateSingleSessionAction = () => {
  const router = useRouter()
  const setCache = useCacheStore<SessionFormValuesCache, 'set'>((state) => state.set)

  return useAction(createSingleSession, {
    onSuccess({ input: { settings, forceStart } }) {
      if (forceStart) {
        toast.warning('Previous session has been abandoned.', {
          description: 'Session is saved, but cannot be continued.'
        })
      }

      const { type, mode, tableSize } = settings
      toast.success('Game session started!', {
        description: `${type} | ${mode} | ${tableSize}`
      })
    },
    onError({ error, input: values }) {
      if (error.serverError?.key === "ACTIVE_SESSION") {
        const { message, description, data = null } = error.serverError

        const errorData = data as { activeSessionMode: GameMode } | null
        if (errorData?.activeSessionMode !== "SINGLE") {
          router.push("/game/reconnect")
          toast.warning(message, { description })
          return
        }

        setCache(values)
        router.push('/game/setup/warning')
        return
      }

      handleServerError(error.serverError, 'Failed to start game session. Please try again later.')
    }
  })
}
