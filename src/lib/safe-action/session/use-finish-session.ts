import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

// actions
import { finishSession } from "@/server/actions/session"

// utils
import { handleServerError } from "@/lib/utils/error"

export const useFinishSessionAction = () => useAction(finishSession, {
  onSuccess() {
    toast.success('You finished your game session!', {
      description: 'Session data has been successfully saved.'
    })
  },
  onError({ error }) {
    handleServerError(error.serverError, 'Failed to save game session.')
  }
})
