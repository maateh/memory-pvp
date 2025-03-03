// types
import type { ClientSessionCard } from "@repo/schema/session"
import type { UseGameplayHandlerProps } from "./use-gameplay-handler"
import type { UseHeartbeatListenerProps } from "./use-heartbeat-listener"

// hooks
import { useSessionStore } from "@/components/provider/session-store-provider"
import { useGameplayHandler } from "./use-gameplay-handler"
import { useHeartbeatListener } from "./use-heartbeat-listener"

type UseSingleplayerGameHandlerProps = UseGameplayHandlerProps
  & Partial<Pick<UseHeartbeatListenerProps, "onHeartbeat">>

type UseSingleplayerGameHandlerReturn = {
  handleCardFlip: (clickedCard: ClientSessionCard) => void
}

/**
 * Custom React hook to manage single-player game mechanics.
 *
 * - Uses `useGameplayHandler` to handle in-game updates, finishing conditions, and tab close events.
 * - Uses `useHeartbeatListener` to synchronize game state at a regular interval.
 * - Provides `handleCardFlip` to manage the logic of flipping cards and checking for matches.
 *
 * @param {UseSingleplayerGameHandlerProps} props - Configuration options for the single-player game handler.
 * @param {() => void} [props.onIngameUpdate] - Callback triggered when the session state updates.
 * @param {(event: BeforeUnloadEvent) => void} [props.onBeforeUnload] - Callback triggered when the tab is about to close.
 * @param {() => Promise<void> | void | never} props.onFinish - Callback triggered when the game finishes (all cards matched).
 * @param {() => Promise<void> | void} [props.onHeartbeat] - Optional callback for periodic session synchronization.
 *
 * @returns {UseSingleplayerGameHandlerReturn} - An object containing `handleCardFlip` to manage card flipping logic.
 */
export function useSingleplayerGameHandler({
  onIngameUpdate,
  onBeforeUnload,
  onFinish,
  onHeartbeat
}: UseSingleplayerGameHandlerProps): UseSingleplayerGameHandlerReturn {
  const session = useSessionStore((state) => state.session)
  const syncStatus = useSessionStore((state) => state.syncStatus)

  const sessionCardFlip = useSessionStore((state) => state.sessionCardFlip)
  const sessionCardMatch = useSessionStore((state) => state.sessionCardMatch)
  const sessionCardUnmatch = useSessionStore((state) => state.sessionCardUnmatch)

  /**
   * Flips the clicked memory card and handles pairing logic.
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

  useGameplayHandler({ onIngameUpdate, onBeforeUnload, onFinish })

  useHeartbeatListener({
    disabled: !onHeartbeat || syncStatus === "synchronized",
    onHeartbeat: onHeartbeat ? onHeartbeat : () => {}
  })

  return { handleCardFlip }
}
