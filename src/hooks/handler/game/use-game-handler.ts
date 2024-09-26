import { useCallback, useEffect } from "react"
import { redirect } from "next/navigation"

// hooks
import { useSessionStore } from "@/hooks/store/use-session-store"

type UseGameHandlerProps = {
  onIngameUpdate: () => void
  onFinish: () => void
}

export const useGameHandler = ({ onIngameUpdate, onFinish }: UseGameHandlerProps) => {
  /** Check if there is any registered session. */
  const clientSession = useSessionStore((state) => state.session)
  if (!clientSession) redirect('/game/setup')

  /** Initialize required states and handlers for the game. */
  const updateCards = useSessionStore((state) => state.updateCards)
  const updateFlippedCards = useSessionStore((state) => state.updateFlippedCards)
  const clearFlippedCards = useSessionStore((state) => state.clearFlippedCards)
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
    
    let updatedCards = clientSession.cards.map((card) =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    )
    updateCards(updatedCards)

    const flipped = [...clientSession.flippedCards, clickedCard]
    updateFlippedCards(clickedCard)

    if (flipped.length < 2) return

    if (flipped[0].key === flipped[1].key) {
      setTimeout(() => {
        updatedCards = updatedCards.map(
          (card) => card.key === flipped[0].key
            ? { ...card, isMatched: true }
            : card
        )

        updateCards(updatedCards)
        clearFlippedCards()
      }, 1000)
    } else {
      setTimeout(() => {
        updatedCards = updatedCards.map((card) =>
          flipped.some(fc => fc.id === card.id)
            ? { ...card, isFlipped: false }
            : card
        )

        updateCards(updatedCards)
        clearFlippedCards()
      }, 1000)
    }
  }

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
    const isOver = clientSession.cards.every(card => card.isMatched)
    if (!isOver) {
      onIngameUpdate()
      return
    }

    onFinish()
    return () => {
      unregisterSession()
    }
  }, [clientSession, unregisterSession, onIngameUpdate, onFinish])

  return { clientSession, handleCardFlip }
}
