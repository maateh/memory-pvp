import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

// actions
import { saveOfflineSession } from "@/server/actions/session"

// utils
import { handleActionError } from "@/lib/utils"
import { clearSessionFromStorage } from "@/lib/utils/storage"

export const useSaveOfflineSessionAction = () => useAction(saveOfflineSession, {
  onSuccess: () => {
    clearSessionFromStorage()

    toast.success('Offline game session has been saved.', {
      description: "This results will not be included in your statistics."
    })
  },
  onError: ({ error }) => {
    handleActionError(error.serverError, "Offline game session could not be saved.")
  }
})
