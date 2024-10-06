"use client"

import { useRouter } from "next/navigation"

import { toast } from "sonner"

// constants
import { offlineSessionMetadata } from "@/constants/session"

// utils
import { getSessionFromStorage } from "@/lib/utils/storage"

// components
import { SessionStats } from "@/components/session"
import { WarningActionButton, WarningCancelButton, WarningModal, WarningModalFooter } from "@/components/shared"

// hooks
import { useCacheStore, type CacheStore } from "@/hooks/store/use-cache-store"

export type SessionRunningWarningActions = {
  forceStart: () => void
  continuePrevious: () => void
}

type SessionRunningWarningModalProps = {
  session: ClientGameSession | null
  isOffline: boolean
}

const SessionRunningWarningModal = ({ session, isOffline }: SessionRunningWarningModalProps) => {
  const router = useRouter()

  const clearCache = useCacheStore((state) => state.clear)
  const setupGameCache = useCacheStore<
    SessionRunningWarningActions,
    CacheStore<SessionRunningWarningActions>['data']
  >((state) => state.data)

  if (isOffline) {
    const offlineSession = getSessionFromStorage()
    session = { ...offlineSession!, ...offlineSessionMetadata }
  }

  const handleStartNew = () => {
    if (!setupGameCache) {
      toast.warning("Missing data to start new game session.", {
        description: "Sorry, but we couldn't find the necessary data to start a new game session. Please fill out the form again."
      })
      router.replace('/game/setup')
      return
    }

    setupGameCache.forceStart()
    clearCache()
  }

  const handleContinue = () => {
    if (!setupGameCache) {
      toast.warning("Missing data to continue game session.", {
        description: "Sorry, but we couldn't find the necessary data to continue your game session. Please fill out the form again."
      })
      router.replace('/game/setup')
      return
    }

    setupGameCache.continuePrevious()
    clearCache()
  }

  return (
    <WarningModal
      title={(
        <>
          <span className="text-destructive font-semibold">Active</span> session found
        </>
      )}
      description="We found a previous session that you haven&apos;t finished yet. Do you want to finish it now or start a new session?"
      onOpenChange={() => router.replace('/game/setup')}
      open
    >
      <SessionStats session={session!} />

      <WarningModalFooter>
        <WarningCancelButton onClick={handleStartNew}>
          Start new game
        </WarningCancelButton>

        <WarningActionButton
          variant="secondary"
          onClick={handleContinue}
        >
          Continue previous
        </WarningActionButton>
      </WarningModalFooter>
    </WarningModal>
  )
}

export default SessionRunningWarningModal
