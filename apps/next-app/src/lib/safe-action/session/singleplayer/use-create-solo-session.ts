import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

// types
import type { MatchFormat, SessionMode } from "@repo/db"
import type { SessionFormValuesCache } from "@/components/session/form/session-form"

// actions
import { createSoloSession } from "@/server/action/session/singleplayer-action"

// utils
import { ServerError } from "@repo/server/error"
import { handleServerError } from "@/lib/util/error"

// hooks
import { useCacheStore } from "@/hooks/store/use-cache-store"

export const useCreateSoloSessionAction = () => {
  const router = useRouter()

  const [activeMode, setActiveMode] = useState<SessionMode>("CASUAL")
  const setCache = useCacheStore<SessionFormValuesCache, "set">((state) => state.set)

  return useAction(createSoloSession, {
    onExecute() {
      toast.loading("Creating session...", { id: "session:create" })
    },
    onSettled() {
      toast.dismiss("session:create")
    },
    onSuccess({ input: { settings, forceStart } }) {
      toast.dismiss("session:create:error")

      if (forceStart) {
        toast.warning("Active solo session has been force closed.", {
          id: "session:force_closed",
          description:
            activeMode === "CASUAL"
              ? "This will not affect your ranking scores."
              : "You might lose ELO because this was a ranked match."
        })
      }

      const { mode, format, tableSize } = settings
      toast.success("Solo game session started!", {
        id: "session:created",
        description: `${mode} | ${format} | ${tableSize}`
      })
    },
    onError({ error, input: values }) {
      if (error.serverError?.key === "ACTIVE_SESSION") {
        const {
          message,
          description,
          data: { format, mode } = { mode: "CASUAL", format: "SOLO" }
        } = error.serverError as ServerError<{
          mode: SessionMode
          format: Extract<MatchFormat, "SOLO">
        }>

        setActiveMode(mode)
        setCache(values)

        toast.warning(message, { description, id: "session:create:error" })
        router.push(`/game/setup/warning?format=${format}`)
        return
      }

      handleServerError(error.serverError, "Failed to start solo game session. Please try again later.")
    }
  })
}
