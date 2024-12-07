import { useRouter } from "next/navigation"
import { toast } from "sonner"

// types
import type { SessionFormValuesCache } from "@/components/session/form/session-form"

// config
import { offlinePlayerMetadata } from "@/config/player-settings"

// helpers
import { generateSessionCards } from "@/lib/helpers/session"
import { pairSessionCardsWithCollection } from "@/lib/helpers/collection"

// utils
import { getSessionFromStorage, saveSessionToStorage } from "@/lib/utils/storage"

// hooks
import { useCacheStore } from "@/hooks/store/use-cache-store"

export const useCreateOfflineSession = () => {
  const router = useRouter()

  const setCache = useCacheStore<SessionFormValuesCache, 'set'>((state) => state.set)

  /**
   * Executes the logic for starting an offline game session based on the provided session values and card collection.
   * 
   * - Validates if the selected session type and mode are supported for offline play (must be `CASUAL` and `SINGLE`).
   * - Checks for any ongoing offline sessions and handles warnings or redirection if needed.
   * - Ensures that a card collection is selected before proceeding.
   * - Generates and stores a new offline game session in `localStorage`.
   * - Redirects the user to the offline game page upon successful session creation.
   * 
   * @param {SessionFormValuesCache} values - Object containing session values and the selected card collection.
   * @returns {void}
   */
  const execute = ({ sessionValues, collection }: SessionFormValuesCache): void => {
    /* Checks if the values are valid for an offline session */
    if (sessionValues.type !== 'CASUAL' || sessionValues.mode !== 'SINGLE') {
      toast.warning('Not supported in Offline mode!', {
        description: "You can only play Casual and Single mode in offline."
      })
      return
    }

    /* Checks if there is any ongoing offline session */
    if (getSessionFromStorage() && !sessionValues.forceStart) {
      setCache({ sessionValues, collection })
      router.push('/game/setup/warning/offline')
      return
    }

    /* Checks if card collection is selected or not */
    if (!sessionValues.collectionId || !collection) {
      toast.warning('Missing card collection!', {
        description: "If you want to play in Offline, you need to select a card collection in advanced."
      })
      return
    }

    /* Creates and stores the offline session using `localStorage` */
    saveSessionToStorage({
      tableSize: sessionValues.tableSize,
      startedAt: new Date(),
      flipped: [],
      cards: pairSessionCardsWithCollection(
        generateSessionCards(collection),
        collection.cards
      ),
      collectionId: sessionValues.collectionId,
      players: { current: offlinePlayerMetadata },
      stats: {
        timer: 0,
        flips: {
          [offlinePlayerMetadata.tag]: 0
        },
        matches: {
          [offlinePlayerMetadata.tag]: 0
        }
      }
    })

    /* Redirects the user to the game page */
    if (sessionValues.forceStart) router.replace('/game/offline')
    else router.push('/game/offline')

    toast.success('Game started in offline mode!', {
      description: `${sessionValues.type} | ${sessionValues.mode} | ${sessionValues.tableSize}`
    })
  }

  return { execute }
}
