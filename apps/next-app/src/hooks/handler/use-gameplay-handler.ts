import { useEffect, useRef } from "react"

// hooks
import { useSessionStore } from "@/components/provider/session-store-provider"

export type UseGameplayHandlerProps = {
  onIngameUpdate?: () => void
  onBeforeUnload?: (event: BeforeUnloadEvent) => void
  onFinish: () => Promise<void> | void | never
}

/**
 * TODO: write doc
 * 
 * @param props
 */
export function useGameplayHandler({ onIngameUpdate, onBeforeUnload, onFinish }: UseGameplayHandlerProps) {
  const session = useSessionStore((state) => state.session)

  const ingameUpdateRef = useRef(onIngameUpdate)
  const beforeUnloadRef = useRef(onBeforeUnload)
  const finishRef = useRef(onFinish)

  useEffect(() => {
    ingameUpdateRef.current = onIngameUpdate
    beforeUnloadRef.current = onBeforeUnload
    finishRef.current = onFinish
  }, [onIngameUpdate, onBeforeUnload, onFinish])

  /**
   * Handles session updates and game completion.
   * 
   * - Executes session finish callback if all cards are matched (game ended).
   * 
   * - Can perform ingame updates if the session has been updated.
   * 
   * - Captures browser tab/window closing events and executes a (possibly)
   *   session saving callback. (Can be useful for offline sessions)
   */
  useEffect(() => {
    const isOver = session.cards.every((card) => card.matchedBy !== null)
    if (isOver) {
      finishRef.current()
      return
    }

    if (ingameUpdateRef.current) {
      ingameUpdateRef.current()
    }

    if (beforeUnloadRef.current) {
      window.addEventListener('beforeunload', beforeUnloadRef.current)
    }

    return () => {
      if (beforeUnloadRef.current) {
        window.removeEventListener('beforeunload', beforeUnloadRef.current)
      }
    }
  }, [session])
}
