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
   * Starts an offline game session based on form values.
   * 
   * @param {StartGameFormValues} values - The form values for starting the game.
   * @param {UseFormReturn<StartGameFormValues>} form - The form state and methods.
   * @param {boolean} [forceStart=false] - Forces a new session if true.
   * 
   * - If an offline session exists and `forceStart` is false, redirects to a warning.
   * - Only supports 'CASUAL' and 'SINGLE' modes in offline; shows a warning otherwise.
   * - Creates and saves a new session, then redirects to the offline game page.
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
   * Continues a previously saved offline session.
   * 
   * @param {UseFormReturn<StartGameFormValues>} form - The form state and methods.
   * 
   * - Loads the offline session from storage; shows a warning if none is found.
   * - Registers the session and continues the game, displaying a success message.
   * - Resets the form and redirects to the offline game page.
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
