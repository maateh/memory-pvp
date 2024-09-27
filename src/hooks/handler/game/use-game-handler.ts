import { useEffect, useRef } from "react"
import { redirect } from "next/navigation"

// hooks
import { useSessionStore } from "@/hooks/store/use-session-store"

type UseGameHandlerProps = {
  onIngameUpdate?: () => void
  onHeartbeat?: () => Promise<void>
  onBeforeUnload?: (event: BeforeUnloadEvent) => Promise<void>
  onFinish: () => Promise<void> | void | never
}

type UseGameHandlerReturn = {
  clientSession: ClientGameSession
  handleCardFlip: (clickedCard: MemoryCard) => void
}

/**
 * Custom hook to manage game session handling, including card flips,
 * sending heartbeats, session updates, and game completion.
 * 
 * @param {UseGameHandlerProps} props - The props containing callbacks for session updates, heartbeat, before unload, and finish events.
 * 
 * - `onIngameUpdate`: Called for updates during the game.
 * - `onHeartbeat`: Periodically sends a heartbeat to keep the session alive in online 'Single' mode.
 * - `onBeforeUnload`: Called before the window is closed, potentially for session saving.
 * - `onFinish`: Called when the game ends, i.e., all cards are matched.
 * 
 * This hook provides:
 * 
 * 1. **Card flipping logic** (`handleCardFlip`):
 *    - Flips cards and handles matching, updating the session accordingly.
 * 
 * 2. **Heartbeat listener**:
 *    - Sends periodic heartbeats (every 5 seconds) to keep the session alive if `onHeartbeat` is provided.
 * 
 * 3. **Session management**:
 *    - Registers the session, tracks game progress, and triggers the finish logic when the game is over.
 * 
 * @returns {UseGameHandlerReturn} - An object containing:
 * - `clientSession`: The current session data.
 * - `handleCardFlip`: Function to handle card flipping logic.
 */
export const useGameHandler = ({
  onIngameUpdate,
  onHeartbeat,
  onBeforeUnload,
  onFinish
}: UseGameHandlerProps): UseGameHandlerReturn => {
  /** Check if there is any registered session. */
  const clientSession = useSessionStore((state) => state.session)
  if (!clientSession) redirect('/game/setup')

  /** Initialize required states and handlers for the game. */
  const shouldStore = useSessionStore((state) => state.shouldStore)
  const handleFlipUpdate = useSessionStore((state) => state.handleFlipUpdate)
  const handleMatchUpdate = useSessionStore((state) => state.handleMatchUpdate)
  const handleUnmatchUpdate = useSessionStore((state) => state.handleUnmatchUpdate)
  const unregisterSession = useSessionStore((state) => state.unregister)

  /**
   * Flips the clicked memory card and handles matching logic.
   * 
   * @param {MemoryCard} clickedCard - The card clicked by the user.
   * 
   * - Ignores clicks if two cards are already flipped or if the card is matched.
   * - Updates card flip state and checks for a match once two cards are flipped.
   * - If matched, marks both cards as matched. Otherwise, flips them back after a delay.
   */
  const handleCardFlip = (clickedCard: MemoryCard) => {
    if (clientSession.flippedCards.length === 2 || clickedCard.isMatched) return

    const flipped = [...clientSession.flippedCards, clickedCard]
    handleFlipUpdate(clickedCard)

    if (flipped.length < 2) return

    if (flipped[0].key === flipped[1].key) {
      handleMatchUpdate()
    } else {
      handleUnmatchUpdate()
    }
  }

  /**
   * Create a heartbeat listener to keep the game session alive.
   * 
   * - Heartbeat listener automatically starts when `onHeartbeat` is
   *   provided and 'shouldStore=[true]'. Also, it cleans up the
   *   interval when the component unmounts or dependencies change.
   * 
   * - It's useful in online 'Single' mode to ensure that the
   *   session remains active by sending periodic heartbeats.
   * 
   * - Note: The first 'useEffect' is necessary because it keeps
   *   the 'heartbeatRef' up to date. Using 'heartbeatRef' makes
   *   it possible to prevent 'useEffect' from retriggering
   *   every time when 'onHeartbeat' changes.
   */
  const heartbeatRef = useRef(onHeartbeat)

  useEffect(() => {
    heartbeatRef.current = onHeartbeat
  }, [onHeartbeat])

  useEffect(() => {
    if (!heartbeatRef.current || !shouldStore) return

    const heartbeatInterval = setInterval(() => {
      heartbeatRef.current?.()
    }, 5000)

    return () => {
      clearInterval(heartbeatInterval)
    }
  }, [shouldStore])

  /**
   * Handles session updates and game completion.
   * 
   * - Perform updates if the session has not yet ended.
   * 
   * - Captures browser tab/window closing events and executes
   *   a (possibly) session saving callback.
   * 
   * - Executes session finish callback if all cards are matched (game ended).
   */
  useEffect(() => {
    if (onBeforeUnload) {
      window.addEventListener('beforeunload', onBeforeUnload)
    }

    const isOver = clientSession.cards.every(card => card.isMatched)
    if (!isOver) {
      onIngameUpdate?.()
      return
    }

    onFinish()
    return () => {
      if (onBeforeUnload) {
        window.removeEventListener('beforeunload', onBeforeUnload)
      }

      unregisterSession()
    }
  }, [clientSession, unregisterSession, onIngameUpdate, onBeforeUnload, onFinish])

  return { clientSession, handleCardFlip }
}
