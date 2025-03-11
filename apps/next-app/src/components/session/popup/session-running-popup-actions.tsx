"use client"

import Link from "next/link"
import { toast } from "sonner"

// types
import type { ClientSession } from "@repo/schema/session"
import type { SessionFormValuesCache } from "@/components/session/form/session-form"

// utils
import { logError } from "@/lib/util/error"

// shadcn
import { Button } from "@/components/ui/button"

// hooks
import { useCacheStore } from "@/hooks/store/use-cache-store"
import { useCreateOfflineSession } from "@/hooks/handler/session/use-create-offline-session"
import { useCreateSoloSessionAction } from "@/lib/safe-action/session"
import { useCreateRoomAction } from "@/lib/safe-action/room"

type SessionRunningPopupActionsProps = {
  activeSessionFormat: ClientSession["format"]
}

const SessionRunningPopupActions = ({ activeSessionFormat }: SessionRunningPopupActionsProps) => {
  const {
    executeAsync: createSoloSession,
    status: createSoloSessionStatus
  } = useCreateSoloSessionAction()

  const {
    executeAsync: createWaitingRoom,
    status: createWaitingRoomStatus
  } = useCreateRoomAction()

  const { execute: createOfflineSession } = useCreateOfflineSession()

  const {
    settings,
    collection
  } = useCacheStore<SessionFormValuesCache, "cache">((state) => state.cache) || {}

  const handleForceStart = async () => {
    if (!settings) {
      toast.error("Session settings data not not found.", {
        description: "Please try reloading the page."
      })
      return
    }

    if (settings.format === "OFFLINE") {
      createOfflineSession({
        settings,
        collection,
        forceStart: true
      })
      return
    }

    try {
      if (settings.format === "SOLO") {
        await createSoloSession({ settings, forceStart: true })
        return
      }

      /**
       * Note: This part of the code will probably never be reached, because
       * currently there is no option to force start a multiplayer session.
       */
      await createWaitingRoom({ settings })
    } catch (err) {
      logError(err)
    }
  }

  const continueText = activeSessionFormat === "OFFLINE" ? "Continue offline"
    : activeSessionFormat === "SOLO"
      ? "Continue session"
      : "Reconnect"

  const continueHref = activeSessionFormat === "OFFLINE" ? "/game/offline"
    : activeSessionFormat === "SOLO"
      ? "/game/single"
      : "/game/multiplayer"

  const startText = settings?.format === "OFFLINE" ? "Start new game (Offline)"
    : settings?.format === "SOLO"
      ? "Start new game"
      : "Create new room"

  return (
    <>
      <Button
        variant="outline"
        disabled={createSoloSessionStatus === "executing" || createWaitingRoomStatus === "executing"}
        asChild
      >
        <Link href={continueHref} replace>
          {continueText}
        </Link>
      </Button>

      <Button
        variant="destructive"
        onClick={handleForceStart}
        disabled={createSoloSessionStatus === "executing" || createWaitingRoomStatus === "executing"}
      >
        {startText}
      </Button>
    </>
  )
}

export default SessionRunningPopupActions
