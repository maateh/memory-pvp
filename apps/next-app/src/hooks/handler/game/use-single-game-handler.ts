import { useEffect, useRef } from "react"

// types
import type { ClientSessionCard } from "@repo/schema/session"

// hooks
import { useSessionStore } from "@/components/provider/session-store-provider"

type UseSingleGameHandlerProps = {
  onIngameUpdate?: () => void
  onHeartbeat?: () => Promise<void>
  onBeforeUnload?: (event: BeforeUnloadEvent) => Promise<void>
  onFinish: () => Promise<void> | void | never
}

type UseSingleGameHandlerReturn = {
  handleCardFlip: (clickedCard: ClientSessionCard) => void
}

/**
 * Custom hook to manage game session handling, including card flips,
 * sending heartbeats, session updates, and game completion.
 * 
 * @param {UseSingleGameHandlerProps} props - The props containing callbacks for session updates, heartbeat, before unload, and finish events.
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
 * @returns {UseSingleGameHandlerReturn} - An object containing:
 * - `handleCardFlip`: Function to handle card flipping logic.
 */
export const useSingleGameHandler = ({
  onIngameUpdate,
  onHeartbeat,
  onBeforeUnload,
  onFinish
}: UseSingleGameHandlerProps): UseSingleGameHandlerReturn => {
  const session = useSessionStore((state) => state.session)

  /** Initialize required states and handlers for the game. */
  const sessionCardFlip = useSessionStore((state) => state.sessionCardFlip)
  const sessionCardMatch = useSessionStore((state) => state.sessionCardMatch)
  const sessionCardUnmatch = useSessionStore((state) => state.sessionCardUnmatch)

  /**
   * Flips the clicked memory card and handles matching logic.
   * 
   * @param {ClientSessionCard} clickedCard - The card clicked by the user.
   * 
   * - Ignores clicks if two cards are already flipped or if the card is matched.
   * - Updates card flip state and checks for a match once two cards are flipped.
   * - If matched, marks both cards as matched. Otherwise, flips them back after a delay.
   */
  const handleCardFlip = (clickedCard: ClientSessionCard) => {
    const flippable = session.flipped.length < 2
      && session.flipped.every(({ key }) => clickedCard.key !== key)
      && clickedCard.matchedBy === null

    if (!flippable) return
    sessionCardFlip(clickedCard)

    const flipped: PrismaJson.SessionCardMetadata[] = [
      ...session.flipped,
      { id: clickedCard.id, key: clickedCard.key }
    ]

    if (flipped.length < 2) return

    if (flipped[0].id === flipped[1].id) sessionCardMatch()
    else setTimeout(sessionCardUnmatch, 800)
  }

  /**
   * Initialize callbacks. It needs to be done this way (by refs)
   * to prevent 'useEffects' from retriggering every time
   * when any of these callbacks change.
   * 
   * Reason: Callbacks usually uses 'clientSession' which would lead
   * to retrigger 'useEffect' unnecessarily in most of the case.
   */
  const heartbeatRef = useRef(onHeartbeat)
  const ingameUpdateRef = useRef(onIngameUpdate)
  const beforeUnloadRef = useRef(onBeforeUnload)
  const finishRef = useRef(onFinish)

  useEffect(() => {
    heartbeatRef.current = onHeartbeat
    ingameUpdateRef.current = onIngameUpdate
    beforeUnloadRef.current = onBeforeUnload
    finishRef.current = onFinish
  }, [onHeartbeat, onIngameUpdate, onBeforeUnload, onFinish])

  /**
   * Create a heartbeat listener to keep the game session alive.
   * 
   * - Heartbeat listener automatically starts when `onHeartbeat` is
   *   provided and 'syncState="OUT_OF_SYNC"'. Also, it cleans up the
   *   interval when the component unmounts or dependencies change.
   * 
   * - It's useful in online 'Single' mode to ensure that the
   *   session remains active by sending periodic heartbeats.
   */
  // FIXME: implement synchronization status and indicator
  // useEffect(() => {
  //   if (!heartbeatRef.current || syncState !== 'OUT_OF_SYNC') return

  //   const heartbeatInterval = setInterval(() => {
  //     heartbeatRef.current?.()
  //   }, 5000)

  //   return () => {
  //     clearInterval(heartbeatInterval)
  //   }
  // }, [syncState])

  /**
   * Handles session updates and game completion.
   * 
   * - Executes session finish callback if all cards are matched (game ended).
   * 
   * - Perform updates if the session has not yet ended.
   * 
   * - Captures browser tab/window closing events and executes
   *   a (possibly) session saving callback.
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

  return { handleCardFlip }
}
