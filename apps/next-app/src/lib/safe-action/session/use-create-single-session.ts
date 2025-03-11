import { useRouter } from "next/navigation"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

// types
import type { SessionFormValuesCache } from "@/components/session/form/session-form"

// actions
import { createSingleSession } from "@/server/action/session-action"

// utils
import { handleServerError } from "@/lib/util/error"

// hooks
import { useCacheStore } from "@/hooks/store/use-cache-store"

export const useCreateSingleSessionAction = () => {
  const router = useRouter()
  const setCache = useCacheStore<SessionFormValuesCache, "set">((state) => state.set)

  return useAction(createSingleSession, {
    onSuccess({ input: { settings, forceStart } }) {
      if (forceStart) {
        toast.warning("Previous session has been abandoned.", {
          description: "Session is saved, but cannot be continued."
        })
      }

      const { mode, format, tableSize } = settings
      toast.success("Game session started!", {
        description: `${mode} | ${format} | ${tableSize}`
      })
    },
    onError({ error, input: values }) {
      if (error.serverError?.key === "ACTIVE_SESSION") {
        const { message, description } = error.serverError

        setCache(values)
        toast.warning(message, { description })
        router.push(`/game/setup/warning?format=SINGLE`)
        return
      }

      handleServerError(error.serverError, "Failed to start game session. Please try again later.")
    }
  })
}
