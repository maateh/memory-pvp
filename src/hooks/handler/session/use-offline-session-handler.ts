import { useRouter } from "next/navigation"

import { toast } from "sonner"

// types
import type { UseFormReturn } from "react-hook-form"
import type { StartGameFormValues, StartGameSessionParams } from "@/components/form/start-game-form"

// constants
import { offlineSessionMetadata } from "@/constants/game"

// utils
import { getMockCards } from "@/lib/utils/game"
import { getSessionFromStorage, saveSessionToStorage } from "@/lib/utils/storage"

// hooks
import { useSessionStore } from "@/hooks/store/use-session-store"
import { useCacheStore, type CacheStore } from "@/hooks/store/use-cache-store"

export const useOfflineSessionHandler = () => {
  const router = useRouter()

  const registerSession = useSessionStore((state) => state.register)

  const setCache = useCacheStore<
    StartGameSessionParams,
    CacheStore<StartGameSessionParams>['set']
  >((state) => state.set)

  /**
   * Offline game sessions must be handled in a different way.
   * At game start, we don't interact with the API, but save
   * the game session locally.
   * 
   * TODO: write proper documentation
   */
  const startOfflineSession = (
    values: StartGameFormValues,
    form: UseFormReturn<StartGameFormValues>,
    forceStart: boolean = false
  ) => {
    const offlineSession = getSessionFromStorage()
    if (offlineSession && !forceStart) {
      setCache({ values, form })
      router.replace('/game/setup/warning?sessionId=offline')
      return
    }

    if (values.type !== 'CASUAL' || values.mode !== 'SINGLE') {
      toast.warning('Not supported in Offline mode!', {
        description: "Sorry, but you can only play Casual and Single mode in offline."
      })
      return
    }

    const storageSession: UnsignedClientGameSession = {
      tableSize: values.tableSize,
      startedAt: new Date(),
      flips: 0,
      cards: getMockCards(values.tableSize)
    }

    registerSession({
      ...storageSession,
      ...offlineSessionMetadata
    })
    saveSessionToStorage(storageSession)

    toast.success('Game started in offline mode!', {
      description: `${values.type} | ${values.mode} | ${values.tableSize}`
    })

    form.reset()
    router.replace('/game/offline')
  }

  /**
   * TODO: write documentation
   */
  const continueOfflineSession = (form: UseFormReturn<StartGameFormValues>,) => {
    const offlineSession = getSessionFromStorage()

    if (!offlineSession) {
      toast.warning("Offline session not found.", {
        description: "Sorry, but we couldn't load your previous offline session data. Please start a new game instead."
      })
      return
    }

    registerSession({
      ...offlineSession,
      ...offlineSessionMetadata
    })

    const { type, mode } = offlineSessionMetadata
    toast.info('Offline game continued!', {
      description: `${type} | ${mode} | ${offlineSession.tableSize}`
    })

    form.reset()
    router.replace('/game/offline')
  }

  return {
    startOfflineSession,
    continueOfflineSession
  }
}
