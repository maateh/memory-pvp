import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

// actions
import { forceCloseSoloSession } from "@/server/action/session/singleplayer-action"

// helpers
import { calculateElo } from "@repo/helper/elo"

// utils
import { handleServerError } from "@/lib/util/error"

// hooks
import { useSessionStore } from "@/components/provider/session-store-provider"

export const useForceCloseSoloSessionAction = () => {
  const session = useSessionStore((state) => state.session)

  return useAction(forceCloseSoloSession, {
    onSuccess() {
      const { owner, mode } = session
      const { gainedElo } = calculateElo(session, owner.id, "FORCE_CLOSED")

      toast.warning("Solo session has been force closed.", {
        description: mode === "CASUAL"
          ? "Let's see the results..."
          : `You have lost ${gainedElo} Elo.`
      })
    },
    onError({ error }) {
      handleServerError(error.serverError, "Failed to force close solo game session. Please try again.")
    }
  })
}
