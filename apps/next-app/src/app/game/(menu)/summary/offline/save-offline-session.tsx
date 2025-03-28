"use client"

import { toast } from "sonner"

// types
import type { ClientPlayer } from "@repo/schema/player"
import type { SaveOfflineSessionValidation } from "@repo/schema/session-validation"

// utils
import { getSessionFromStorage } from "@/lib/util/storage"
import { logError } from "@/lib/util/error"

// icons
import { Loader2, Save } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import { GlowingOverlay } from "@/components/shared"
import { PlayerSelectButton } from "@/components/player/select"

// hooks
import { useSaveOfflineSessionAction } from "@/lib/safe-action/session/singleplayer"

type SaveOfflineSessionProps = {
  players: ClientPlayer[]
}

const SaveOfflineSession = ({ players }: SaveOfflineSessionProps) => {
  const {
    executeAsync: saveOfflineSession,
    status: saveOfflineSessionStatus
  } = useSaveOfflineSessionAction()

  const handleSaveOfflineSession = async () => {
    const offlineSession = getSessionFromStorage()
    if (!offlineSession) {
      toast.warning("Offline session cannot be loaded.", {
        description: "Unable to find offline session in your storage."
      })
      return
    }

    const playerId = players.find((player) => player.isActive)?.id
    if (!playerId) {
      toast.warning("Player profile not selected.", {
        description: "Select a player first to save the results."
      })
      return
    }

    try {
      await saveOfflineSession({
        playerId,
        clientSession: offlineSession as SaveOfflineSessionValidation["clientSession"]
      })
    } catch (err) {
      logError(err)
    }
  }

  return (
    <section>
      <div className="flex justify-center items-center gap-x-1.5">
        <h3 className="pb-0.5 text-muted-foreground text-center text-xl small-caps">
          Save <span className="text-accent">offline</span> session as
        </h3>

        <PlayerSelectButton className="w-fit pl-1 pr-1.5 justify-start gap-x-2"
          size="sm"
          players={players}
        />
      </div>

      <p className="mx-auto text-sm text-center font-heading font-normal dark:font-light sm:text-base">
        Select a player profile to save the results of your offline session.
      </p>

      <GlowingOverlay className="w-32 sm:w-36 mt-8 mx-auto py-2.5"
        overlayProps={{
          className: "bg-secondary opacity-90 dark:opacity-45"
        }}
      >
        <Button className="z-10 relative size-full flex-col justify-center gap-y-0.5 rounded-full text-foreground/90 text-sm sm:text-base font-heading"
          variant="ghost"
          size="icon"
          onClick={handleSaveOfflineSession}
          disabled={saveOfflineSessionStatus === "executing"}
        >
          {saveOfflineSessionStatus === "executing" ? (
            <Loader2 className="size-5 shrink-0 animate-spin" />
          ) : (
            <Save className="size-5 shrink-0" />
          )}
          <span>Save results</span>
        </Button>
      </GlowingOverlay>
    </section>
  )
}

export default SaveOfflineSession
