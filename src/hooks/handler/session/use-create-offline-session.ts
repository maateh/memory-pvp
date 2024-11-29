import { useRouter } from "next/navigation"
import { toast } from "sonner"

// types
import type { SessionFormValuesCache } from "@/components/session/form/session-form"

// constants
import { offlinePlayerMetadata } from "@/constants/player"

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
   * TODO: write doc
   * 
   * @param
   * @returns 
   */
  const execute = ({ sessionValues, collection }: SessionFormValuesCache) => {
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
      router.replace('/game/setup/warning/offline')
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
    router.push('/game/offline')
    toast.success('Game started in offline mode!', {
      description: `${sessionValues.type} | ${sessionValues.mode} | ${sessionValues.tableSize}`
    })
  }

  return { execute }
}
