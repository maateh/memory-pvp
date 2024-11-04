import { useRouter } from "next/navigation"
import { toast } from "sonner"

// types
import type { UseFormReturn } from "react-hook-form"
import type { SessionFormValues } from "@/components/session/form/session-form"
import type { SessionRunningWarningActions } from "@/app/game/(base)/setup/@warning/(.)warning/session-warning-modal"

// constants
import { offlineSessionMetadata } from "@/constants/session"
import { offlinePlayerMetadata } from "@/constants/player"

// helpers
import { generateSessionCards } from "@/lib/helpers/session"
import { pairSessionCardsWithCollection } from "@/lib/helpers/collection"

// utils
import { clearSessionFromStorage, getSessionFromStorage, saveSessionToStorage } from "@/lib/utils/storage"

// hooks
import { useSessionStore } from "@/hooks/store/use-session-store"
import { useCacheStore } from "@/hooks/store/use-cache-store"

export const useOfflineSessionHandler = () => {
  const router = useRouter()

  const registerSession = useSessionStore((state) => state.register)
  const unregisterSession = useSessionStore((state) => state.unregister)

  const setCache = useCacheStore<SessionRunningWarningActions, 'set'>((state) => state.set)

  /**
   * Starts an offline game session based on form values.
   * 
   * @param {UseFormReturn<SessionFormValues>} form - The form state and methods.
   * @param {boolean} [forceStart=false] - Forces a new session if true.
   * 
   * - If an offline session exists and `forceStart` is false, redirects to a warning.
   * - Only supports 'CASUAL' and 'SINGLE' modes in offline; shows a warning otherwise.
   * - Creates and saves a new session, then redirects to the offline game page.
   */
  const startOfflineSession = (form: UseFormReturn<SessionFormValues>, collection: ClientCardCollection, forceStart: boolean = false) => {
    const values = form.getValues()

    if (getSessionFromStorage() && !forceStart) {
      setCache({
        forceStart: () => startOfflineSession(form, collection, true),
        continuePrevious: () => continueOfflineSession(form)
      })

      router.replace('/game/setup/warning?slug=offline')
      return
    }

    if (values.type !== 'CASUAL' || values.mode !== 'SINGLE') {
      toast.warning('Not supported in Offline mode!', {
        description: "Sorry, but you can only play Casual and Single mode in offline."
      })
      return
    }

    if (!values.collectionId || !collection) {
      toast.warning('Missing card collection!', {
        description: "If you want to play in Offline, you need to select a card collection in advanced."
      })
      return
    }

    const sessionCards = generateSessionCards(collection)

    const offlineSession: UnsignedClientGameSession = {
      tableSize: values.tableSize,
      startedAt: new Date(),
      flipped: [],
      cards: pairSessionCardsWithCollection(sessionCards, collection.cards),
      collectionId: values.collectionId,
      players: {
        current: offlinePlayerMetadata
      },
      stats: {
        timer: 0,
        flips: {
          [offlinePlayerMetadata.tag]: 0
        },
        matches: {
          [offlinePlayerMetadata.tag]: 0
        }
      }
    }

    saveSessionToStorage(offlineSession)
    registerSession({
      ...offlineSession,
      ...offlineSessionMetadata
    })

    toast.success('Game started in offline mode!', {
      description: `${values.type} | ${values.mode} | ${values.tableSize}`
    })

    form.reset()
    router.replace('/game/offline')
  }

  /**
   * Continues a previously saved offline session.
   * 
   * @param {UseFormReturn<SessionFormValues>} form - The form state and methods.
   * 
   * - Loads the offline session from storage; shows a warning if none is found.
   * - Registers the session and continues the game, displaying a success message.
   * - Resets the form and redirects to the offline game page.
   */
  const continueOfflineSession = (form: UseFormReturn<SessionFormValues>,) => {
    const offlineSession = getSessionFromStorage()

    if (!offlineSession) {
      toast.warning("Offline session not found.", {
        description: "Sorry, but we couldn't load your previous offline session data. Please start a new game instead."
      })
      return
    }

    registerSession({
      ...offlineSession,
      ...offlineSessionMetadata,
      continuedAt: new Date()
    })

    const { type, mode } = offlineSessionMetadata
    toast.info('Offline game continued!', {
      description: `${type} | ${mode} | ${offlineSession.tableSize}`
    })

    form.reset()
    router.replace('/game/offline')
  }

  const abandonOfflineSession = () => {
    clearSessionFromStorage()
    unregisterSession()
    
    toast.info('Your offline session has been abandoned.', {
      description: 'Abandoned offline sessions are not saved.'
    })
  }

  return {
    startOfflineSession,
    continueOfflineSession,
    abandonOfflineSession
  }
}
