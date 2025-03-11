import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

// actions
import { finishSoloSession } from "@/server/action/session/singleplayer-action"

// utils
import { handleServerError } from "@/lib/util/error"

export const useFinishSoloSessionAction = () =>
  useAction(finishSoloSession, {
    onSuccess() {
      toast.success("Solo game session finished!", {
        // TODO: show `gainedElo` here
        description: "Session data has been successfully saved."
      })
    },
    onError({ error }) {
      handleServerError(error.serverError, "Failed to save solo game session.")
    }
  })
