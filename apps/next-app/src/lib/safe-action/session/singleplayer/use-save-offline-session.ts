import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

// actions
import { saveOfflineSession } from "@/server/action/session/singleplayer-action"

// utils
import { handleServerError } from "@/lib/util/error"
import { clearSessionFromStorage } from "@/lib/util/storage"

export const useSaveOfflineSessionAction = () =>
  useAction(saveOfflineSession, {
    onExecute() {
      toast.loading("Saving offline session...", { id: "session:offline:save" })
    },
    onSettled() {
      toast.dismiss("session:offline:save")
    },
    onSuccess() {
      clearSessionFromStorage()

      toast.success("Offline session has been saved.", {
        id: "session:offline:saved",
        description: "This results will not be included in your statistics."
      })
    },
    onError({ error }) {
      handleServerError(error.serverError, "Offline game session could not be saved.")
    }
  })
