"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
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
import { useCreateSingleSessionAction } from "@/lib/safe-action/session"
import { useCreateRoomAction } from "@/lib/safe-action/room"

type SessionRunningPopupActionsProps = {
  activeSessionMode: ClientSession["mode"]
}

const SessionRunningPopupActions = ({ activeSessionMode }: SessionRunningPopupActionsProps) => {
  const pathname = usePathname()
  const isOffline = pathname === '/game/setup/warning/offline'

  const {
    executeAsync: createSingleSession,
    status: createSingleSessionStatus
  } = useCreateSingleSessionAction()

  const {
    executeAsync: createWaitingRoom,
    status: createWaitingRoomStatus
  } = useCreateRoomAction()

  const { execute: createOfflineSession } = useCreateOfflineSession()

  const {
    settings,
    collection
  } = useCacheStore<SessionFormValuesCache, 'cache'>((state) => state.cache) || {}

  const handleForceStart = async () => {
    if (!settings) {
      toast.error("Session settings data not not found.", {
        description: "Please try reloading the page."
      })
      return
    }

    if (isOffline) {
      createOfflineSession({
        settings,
        collection,
        forceStart: true
      })
      return
    }

    try {
      if (settings.mode === "SINGLE") {
        await createSingleSession({ settings, forceStart: true })
      } else {
        await createWaitingRoom({ settings, forceStart: true })
      }
    } catch (err) {
      logError(err)
    }
  }

  const href = isOffline ? "/game/offline"
    : activeSessionMode === "SINGLE"
      ? "/game/single"
      : "/game/multiplayer"

  return (
    <>
      <Button
        variant="outline"
        disabled={createSingleSessionStatus === "executing" || createWaitingRoomStatus === "executing"}
        asChild
      >
        <Link href={href} replace>
          {activeSessionMode === "SINGLE" ? "Continue session": "Reconnect"}
        </Link>
      </Button>

      <Button
        variant="destructive"
        onClick={handleForceStart}
        disabled={createSingleSessionStatus === "executing" || createWaitingRoomStatus === "executing"}
      >
        {settings?.mode === "SINGLE" ? "Start new game": "Create new room"}
      </Button>
    </>
  )
}

export default SessionRunningPopupActions
