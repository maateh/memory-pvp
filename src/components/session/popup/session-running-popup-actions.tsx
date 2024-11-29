"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { toast } from "sonner"

// types
import type { SessionFormValuesCache } from "@/components/session/form/session-form"

// utils
import { logError } from "@/lib/utils"

// shadcn
import { Button } from "@/components/ui/button"

// hooks
import { useCacheStore } from "@/hooks/store/use-cache-store"
import { useCreateOfflineSession } from "@/hooks/handler/session/use-create-offline-session"
import { useCreateSessionAction } from "@/lib/safe-action/session"

const SessionRunningPopupActions = () => {
  const pathname = usePathname()
  const isOffline = pathname === '/game/setup/warning/offline'

  const { execute: createOfflineSession } = useCreateOfflineSession()
  const {
    executeAsync: executeCreateSession,
    status: createSessionStatus
  } = useCreateSessionAction()

  const {
    sessionValues,
    collection = null
  } = useCacheStore<SessionFormValuesCache, 'cache'>((state) => state.cache) || {}

  const handleForceStart = async () => {
    if (!sessionValues) {
      toast.error("Session cache not not found.", {
        description: "Please try reloading the page."
      })
      return
    }

    if (isOffline) {
      createOfflineSession({
        sessionValues: { ...sessionValues, forceStart: true },
        collection
      })
      return
    }

    try {
      await executeCreateSession({ ...sessionValues, forceStart: true })
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
