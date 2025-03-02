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
 * TODO: write doc
 * 
 * @param props
 * @returns {UseSingleplayerGameHandlerReturn}
 */
export function useSingleplayerGameHandler({
  onIngameUpdate,
  onBeforeUnload,
  onFinish,
  onHeartbeat
}: UseSingleplayerGameHandlerProps): UseSingleplayerGameHandlerReturn {
  const session = useSessionStore((state) => state.session)

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
    // TODO: disabled if session is synchronized
    disabled: !onHeartbeat || true,
    onHeartbeat: onHeartbeat ? onHeartbeat : () => {}
  })

  return { handleCardFlip }
}
