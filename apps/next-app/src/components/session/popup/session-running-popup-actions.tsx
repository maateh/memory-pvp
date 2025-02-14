"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { toast } from "sonner"

// types
import type { SessionFormValuesCache } from "@/components/session/form/session-form"

// utils
import { logError } from "@/lib/util/error"

// shadcn
import { Button } from "@/components/ui/button"

// hooks
import { useCacheStore } from "@/hooks/store/use-cache-store"
import { useCreateOfflineSession } from "@/hooks/handler/session/use-create-offline-session"
import { useCreateSingleSessionAction } from "@/lib/safe-action/session"

const SessionRunningPopupActions = () => {
  const pathname = usePathname()
  const isOffline = pathname === '/game/setup/warning/offline'

  const { execute: createOfflineSession } = useCreateOfflineSession()
  const {
    executeAsync: executeCreateSession,
    status: createSessionStatus
  } = useCreateSingleSessionAction()

  const {
    settings,
    collection = null
  } = useCacheStore<SessionFormValuesCache, 'cache'>((state) => state.cache) || {}

  const handleForceStart = async () => {
    if (!settings) {
      toast.error("Session cache not not found.", {
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
        await executeCreateSession({ settings, forceStart: true })
      } else {
        // TODO: I'm currently not sure how to exactly handle
        // multiplayer sessions in terms of force-start.
        // I think it's not a good approach
        // Two possible aprroaches:
        // - redirect user to `/game/reconnect` page instead of this warning and handle everything there
        // - force-close running (actually cancelled) multiplayer session
      }
    } catch (err) {
      logError(err)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        disabled={createSessionStatus === 'executing'}
        asChild
      >
        <Link href={!isOffline ? '/game/single' : '/game/offline'} replace>
          Continue session
        </Link>
      </Button>

      <Button
        variant="destructive"
        onClick={handleForceStart}
        disabled={createSessionStatus === 'executing'}
      >
        Start new game
      </Button>
    </>
  )
}

export default SessionRunningPopupActions
