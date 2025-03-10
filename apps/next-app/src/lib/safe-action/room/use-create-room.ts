import { useRouter } from "next/navigation"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

// types
import type { GameMode } from "@repo/db"
import type { SessionFormValuesCache } from "@/components/session/form/session-form"

// actions
import { createRoom } from "@/server/action/room-action"

// utils
import { handleServerError } from "@/lib/util/error"

// hooks
import { useCacheStore } from "@/hooks/store/use-cache-store"

export const useCreateRoomAction = () => {
  const router = useRouter()
  const setCache = useCacheStore<SessionFormValuesCache, "set">((state) => state.set)

  return useAction(createRoom, {
    onExecute() {
      toast.loading("Creating room...", { id: "room:create" })
    },
    onSuccess({ input: { forceStart } }) {
      if (forceStart) {
        toast.warning("Previous session has been abandoned.", {
          description: "Session is saved, but cannot be continued."
        })
      }

      toast.loading("Waiting room successfully created!", {
        description: "Connecting to the server...",
        id: "room:connect"
      })
    },
    onError({ error }) {
      if (error.serverError?.key === "ACTIVE_SESSION") {
        const { message, description } = error.serverError

        toast.warning(message, { description })
        router.push("/game/multiplayer")
        return
      }

      if (error.serverError?.key === "ACTIVE_ROOM") {
        const { message, description } = error.serverError

        toast.warning(message, {
          description,
          duration: 10000,
          action: {
            label: "Reconnect",
            onClick() { router.push("/game/multiplayer") }
          }
        })
        return
      }

      handleServerError(error.serverError, "Failed to create waiting room. Please try again later.")
    },
    onSettled() {
      toast.dismiss("room:create")
    }
  })
}
