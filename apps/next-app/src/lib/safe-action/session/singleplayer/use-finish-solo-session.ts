import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

// actions
import { finishSoloSession } from "@/server/action/session/singleplayer-action"

// helpers
import { calculateElo } from "@repo/helper/elo"

// utils
import { handleServerError } from "@/lib/util/error"

export const useFinishSoloSessionAction = () =>
  useAction(finishSoloSession, {
    onSuccess({ input: { clientSession } }) {
      const { owner, mode } = clientSession
      const { gainedElo } = calculateElo(clientSession, owner.id, "FINISHED")

      toast.success("Solo game session finished!", {
        description: mode === "CASUAL"
          ? "Let's see the results..."
          : gainedElo === 0 ? "You have not gained any Elo."
          : `You have ${gainedElo > 0 ? "gained" : "lost"} ${gainedElo} Elo.`
      })
    },
    onError({ error }) {
      handleServerError(error.serverError, "Failed to save solo game session.")
    }
  })
