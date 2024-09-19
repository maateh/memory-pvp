"use client"

import { useRouter } from "next/navigation"

import { toast } from "sonner"

// types
import type { StartGameSessionParams } from "@/components/form/start-game-form"

// constants
import { offlineSessionMetadata } from "@/constants/game"

// shadcn
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

// components
import { SessionStats } from "@/components/session"

// hooks
import { useSessionStore } from "@/hooks/store/use-session-store"
import { useCacheStore, type CacheStore } from "@/hooks/store/use-cache-store"
import { useOfflineSessionHandler } from "@/hooks/handler/session/use-offline-session-handler"

type SessionRunningWarningModalProps = {
  session: ClientGameSession | null
  isOffline: boolean
}

const SessionRunningWarningModal = ({ session, isOffline }: SessionRunningWarningModalProps) => {
  const router = useRouter()

  const clearCache = useCacheStore((state) => state.clear)
  const startFormCache = useCacheStore<
    StartGameSessionParams,
    CacheStore<StartGameSessionParams>['data']
  >((state) => state.data)

  const { startOfflineSession } = useOfflineSessionHandler()

  if (isOffline) {
    const clientSession = useSessionStore.getState().session
    session = { ...clientSession!, ...offlineSessionMetadata }
  }

  const handleStartNew = () => {
    if (!startFormCache) {
      toast.warning("Missing data to start new game session.", {
        description: "Sorry, but we couldn't find the necessary data to start a new game session. Please fill out the form again."
      })
      router.replace('/game/setup')
      return
    }

    const { form, values } = startFormCache
    clearCache()
    
    if (isOffline) {
      startOfflineSession(values, form, true)
      return
    }

    // TODO: start new game session
  }

  const handleContinue = () => {
    const route = isOffline ? '/game/offline' : '/game'
    router.replace(route)
  }

  return (
    <Dialog open onOpenChange={() => router.replace('/game/setup')}>
      <DialogContent>
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl sm:text-2xl font-heading font-normal underline decoration-destructive underline-offset-8">
            <span className="text-destructive font-semibold">Active</span> session found
          </DialogTitle>

          <DialogDescription className="w-5/6 mx-auto">
            We found a previous session that you haven&apos;t finished yet. Do you want to finish it now or start a new session?
          </DialogDescription>
        </DialogHeader>

        <Separator className="w-3/5 mx-auto mt-1 mb-2.5 bg-border/25" />

        <SessionStats session={session!} />

        <DialogFooter className="mt-2.5 mx-8 flex flex-wrap flex-row items-center justify-around gap-x-8 gap-y-2.5 sm:justify-around">
          <Button className="flex-1 max-w-64 border"
            variant="ghost"
            onClick={handleStartNew}
          >
            Start new game
          </Button>
          <Button className="flex-1 max-w-64"
            variant="secondary"
            onClick={handleContinue}
          >
            Continue previous
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SessionRunningWarningModal
