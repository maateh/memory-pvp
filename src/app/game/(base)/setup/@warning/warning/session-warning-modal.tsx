"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"

import { toast } from "sonner"

// constants
import { offlineSessionMetadata } from "@/constants/session"

// utils
import { getSessionFromStorage } from "@/lib/utils/storage"
import { getSessionStatsMap } from "@/lib/utils/stats"

// components
import {
  StatisticItem, StatisticList,
  WarningActionButton, WarningCancelButton, WarningModal, WarningModalFooter
} from "@/components/shared"

// hooks
import { useCacheStore } from "@/hooks/store/use-cache-store"

type SessionRunningWarningActions = {
  forceStart: () => void
  continuePrevious: () => void
}

type SessionRunningWarningModalProps = {
  session: ClientGameSession | null
  isOffline: boolean
}

const SessionRunningWarningModal = ({ session, isOffline }: SessionRunningWarningModalProps) => {
  const router = useRouter()

  const actionsCache = useCacheStore<SessionRunningWarningActions, 'cache'>((state) => state.cache)
  const clearCache = useCacheStore<SessionRunningWarningActions, 'clear'>((state) => state.clear)

  if (isOffline) {
    const offlineSession = getSessionFromStorage()
    session = { ...offlineSession!, ...offlineSessionMetadata }
  }

  const stats = useMemo(() => getSessionStatsMap(session!), [session])

  const handleStartNew = () => {
    if (!actionsCache) {
      toast.warning("Missing data to start new game session.", {
        description: "Sorry, but we couldn't find the necessary data to start a new game session. Please fill out the form again."
      })
      router.replace('/game/setup')
      return
    }

    actionsCache.forceStart()
    clearCache()
  }

  const handleContinue = () => {
    if (!actionsCache) {
      toast.warning("Missing data to continue game session.", {
        description: "Sorry, but we couldn't find the necessary data to continue your game session. Please fill out the form again."
      })
      router.replace('/game/setup')
      return
    }

    actionsCache.continuePrevious()
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
      <StatisticList className="mx-auto">
        {Object.values(stats).map((stat) => (
          <StatisticItem className="min-w-36 max-w-44"
            variant="destructive"
            size="sm"
            statistic={stat}
            key={stat.key}
          />
        ))}
      </StatisticList>

      <WarningModalFooter>
        <WarningCancelButton className="text-destructive/85 border-destructive/40 hover:text-destructive/90 hover:bg-destructive/15 dark:hover:bg-destructive/10"
          onClick={handleStartNew}
        >
          Start new game
        </WarningCancelButton>

        <WarningActionButton onClick={handleContinue}>
          Continue previous
        </WarningActionButton>
      </WarningModalFooter>
    </WarningModal>
  )
}

export default SessionRunningWarningModal
export type { SessionRunningWarningActions }
