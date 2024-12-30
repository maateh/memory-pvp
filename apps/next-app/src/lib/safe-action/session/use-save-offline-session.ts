import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

// actions
import { saveOfflineSession } from "@/server/action/session-action"

// utils
import { handleServerError } from "@/lib/util/error"
import { clearSessionFromStorage } from "@/lib/util/storage"

export const useSaveOfflineSessionAction = () => useAction(saveOfflineSession, {
  onSuccess: () => {
    clearSessionFromStorage()

    toast.success('Offline game session has been saved.', {
      description: "This results will not be included in your statistics."
    })
  },
  onError: ({ error }) => {
    console.log({error})
    handleServerError(error.serverError, "Offline game session could not be saved.")
  }
})
