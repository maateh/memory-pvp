import { useEffect, useRef } from "react"

// hooks
import { useSessionStore } from "@/components/provider/session-store-provider"

export type UseGameplayHandlerProps = {
  onIngameUpdate?: () => void
  onBeforeUnload?: (event: BeforeUnloadEvent) => void
  onFinish: () => Promise<void> | void | never
}

/**
 * Custom React hook for handling gameplay-related events.
 *
 * - Triggers the `onFinish` callback when all cards are matched (game over).
 * - Calls `onIngameUpdate` when the session updates (e.g., card flips, matches).
 * - Listens for browser tab/window close events and executes `onBeforeUnload` if provided.
 *
 * @param {UseGameplayHandlerProps} props - Configuration options for gameplay event handling.
 * @param {() => void} [props.onIngameUpdate] - Callback triggered when the session state updates.
 * @param {(event: BeforeUnloadEvent) => void} [props.onBeforeUnload] - Callback triggered when the tab is about to close.
 * @param {() => Promise<void> | void | never} props.onFinish - Callback triggered when the game finishes (all cards matched).
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
