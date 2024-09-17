import { useRouter } from "next/navigation"

import { toast } from "sonner"

// prisma
import { GameStatus } from "@prisma/client"

// utils
import { getMockCards } from "@/lib/utils"

// types
import type { UseFormReturn } from "react-hook-form"
import type { StartGameFormValues, StartGameSessionParams } from "@/components/form/start-game-form"

// hooks
import { useGameStore } from "@/hooks/use-game-store"
import { CacheStore, useCacheStore } from "@/hooks/use-cache-store"

export const useOfflineSessionHandler = () => {
  const router = useRouter()

  const clientSession = useGameStore((state) => state.session)
  const registerSession = useGameStore((state) => state.register)
  const unregisterSession = useGameStore((state) => state.unregister)

  const setCache = useCacheStore<
    StartGameSessionParams,
    CacheStore<StartGameSessionParams>['set']
  >((state) => state.set)

  /**
   * Offline game sessions must be handled in a different way.
   * At game start, we don't interact with the API, but save
   * the game session locally.
   */
  const startOfflineSession = (
    values: StartGameFormValues,
    form: UseFormReturn<StartGameFormValues>,
    forceStart: boolean = false
  ) => {
    if (clientSession && !forceStart) {
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

    registerSession({
      tableSize: values.tableSize,
      startedAt: new Date(),
      flips: 0,
      cards: getMockCards(values.tableSize)
    })

    toast.success('Game started in offline mode!', {
      description: `${values.type} | ${values.mode} | ${values.tableSize}`
    })

    form.reset()
    router.replace('/game/offline')
  }

  /**
   * If session is offline and status:
   * - 'ABANDONED' -> remove the game session from local store
   * - 'FINISHED' -> redirect user to sign in and save session
   * to database with an 'OFFLINE' game status. (handled by API)
   */
  const finishOfflineSession = (status: typeof GameStatus['ABANDONED' | 'FINISHED']) => {    
    if (status === 'ABANDONED') {
      unregisterSession()

      router.replace('/game/setup')
      toast.warning('Your session has been abandoned.')
      return
    }

    router.replace('/game/offline/save')
    toast.success('You finished your offline game session!', {
      description: "Now, you've been redirected to save your results if you want.",
      /**
       * Note: for a reason, this toast would render twice,
       * (because it is used inside a useEffect elsewhere)
       * so it is prevented by adding a custom id.
       */
      id: '_'
    })
  }

  return { startOfflineSession, finishOfflineSession }
}
