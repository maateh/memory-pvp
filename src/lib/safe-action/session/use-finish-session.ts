import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

// actions
import { finishSession } from "@/server/action/session-action"

// utils
import { handleServerError } from "@/lib/util/error"

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
