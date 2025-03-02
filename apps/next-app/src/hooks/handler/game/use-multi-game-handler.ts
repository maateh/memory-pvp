// types
import type { ClientSessionCard } from "@repo/schema/session"

// hooks
import { useSessionStore } from "@/components/provider/session-store-provider"
import { useMultiEventStore } from "@/components/provider/multi-event-store-provider"

export const useMultiGameHandler = () => {
  const session = useSessionStore((state) => state.session)
  const currentPlayer = useSessionStore((state) => state. currentPlayer)
  const sessionCardFlip = useMultiEventStore((state) => state.sessionCardFlip)
  
  const handleCardFlip = (clickedCard: ClientSessionCard) => {
    const flippable = session.currentTurn === currentPlayer.id
      && session.flipped.length < 2
      && session.flipped.every(({ key }) => clickedCard.key !== key)
      && clickedCard.matchedBy === null

    if (flippable) sessionCardFlip(clickedCard)
  }

  return { handleCardFlip }
}
