import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

// actions
import { forceCloseSoloSession } from "@/server/action/session/singleplayer-action"

// utils
import { handleServerError } from "@/lib/util/error"

export const useForceCloseSoloSessionAction = () =>
  useAction(forceCloseSoloSession, {
    onSuccess() {
      toast.warning("Solo session has been force closed.", {
        // TODO: show `gainedElo` here
        description: "Session is saved, but it cannot be continued."
      })
    },
    onError({ error }) {
      handleServerError(error.serverError, "Failed to force close solo game session. Please try again.")
    }
  })
