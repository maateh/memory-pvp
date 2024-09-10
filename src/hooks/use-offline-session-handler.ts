import { useRouter } from "next/navigation"

import { toast } from "sonner"

// clerk
import { useClerk } from "@clerk/nextjs"

// prisma
import { GameStatus } from "@prisma/client"

// types
import { UseFormReturn } from "react-hook-form"
import { StartGameFormValues } from "@/components/form/start-game-form"

// hooks
import { useGameStore } from "@/hooks/use-game-store"

export const useOfflineSessionHandler = () => {
  const router = useRouter()
  const { user: clerkUser, redirectToSignIn } = useClerk()

  const clientSession = useGameStore((state) => state.get)()
  const registerSession = useGameStore((state) => state.register)
  const unregisterSession = useGameStore((state) => state.unregister)

  /**
   * Offline game sessions must be handled in a different way.
   * At game start, we don't interact with the API, but save
   * the game session locally.
   */
  const startOfflineSession = (values: StartGameFormValues, form: UseFormReturn<StartGameFormValues>) => {
    if (clientSession) {
      // TODO: add option to continue or abandon previous session
    }

    if (values.type !== 'CASUAL' || values.mode !== 'SINGLE') {
      toast.warning('Not supported in Offline mode!', {
        description: "Sorry, but you can only play Casual and Single mode in offline."
      })
      return
    }

    registerSession({
      tableSize: values.tableSize,
      startedAt: new Date()
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
    toast.success('Your session has ended.', {
      description: `Session status: ${status}`
    })
    
    if (status === 'ABANDONED') {
      unregisterSession()
      router.replace('/game/setup')
    }

    const summaryRoute = '/game/offline/save'

    if (clerkUser) {
      router.replace(summaryRoute)
      return
    }

    return redirectToSignIn({
      signInForceRedirectUrl: summaryRoute,
      signUpForceRedirectUrl: summaryRoute
    })
  }

  return { startOfflineSession, finishOfflineSession }
}
