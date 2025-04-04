import { useRouter } from "next/navigation"
import { toast } from "sonner"

// types
import type { SessionFormValuesCache } from "@/components/session/form/session-form"

// config
import { tableSizeMap } from "@repo/config/game"
import { offlinePlayerMetadata } from "@/config/player-settings"

// helpers
import { generateSessionCards, pairSessionCardsWithCollection } from "@/lib/helper/session-helper"

// utils
import { getSessionFromStorage, saveSessionToStorage } from "@/lib/util/storage"

// hooks
import { useCacheStore } from "@/hooks/store/use-cache-store"

export const useCreateOfflineSession = () => {
  const router = useRouter()

  const setCache = useCacheStore<SessionFormValuesCache, "set">((state) => state.set)

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
  const execute = ({ collection, settings, forceStart }: SessionFormValuesCache): void => {
    /* Checks if the values are valid for an offline session */
    if (settings.mode !== "CASUAL") {
      toast.warning("Not supported in Offline mode!", {
        description: "You can only play Casual mode in offline."
      })
      return
    }

    /* Checks if there is any ongoing offline session */
    if (getSessionFromStorage() && !forceStart) {
      setCache({ settings, collection, forceStart })
      router.push("/game/setup/warning?format=OFFLINE")
      return
    }

    /* Checks if card collection is selected or not */
    if (!settings.collectionId || !collection) {
      toast.warning("Missing card collection!", {
        description: "If you want to play in Offline, you need to select a card collection in advanced."
      })
      return
    }

    if (tableSizeMap[settings.tableSize] > tableSizeMap[collection.tableSize]) {
      toast.error("Collection table size is too small.", {
        description: "Table size of the selected collection is incompatible with your settings."
      })
      return
    }

    /* Creates and stores the offline session using `localStorage` */
    saveSessionToStorage({
      collectionId: settings.collectionId,
      tableSize: settings.tableSize,
      flipped: [],
      cards: pairSessionCardsWithCollection(
        generateSessionCards(collection, settings.tableSize),
        collection.cards
      ),
      stats: {
        timer: 0,
        flips: {
          [offlinePlayerMetadata.tag]: 0
        },
        matches: {
          [offlinePlayerMetadata.tag]: 0
        }
      },
      startedAt: new Date(),
      updatedAt: new Date()
    })

    /* Redirects the user to the game page */
    if (forceStart) router.replace("/game/offline")
    else router.push("/game/offline")

    toast.success("Game started in offline mode!", {
      description: `${settings.mode} | ${settings.format} | ${settings.tableSize}`
    })
  }

  return { execute }
}
