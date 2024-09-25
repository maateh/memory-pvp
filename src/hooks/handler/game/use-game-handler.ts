import { useEffect, useState } from "react"
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
  const [flippedCards, setFlippedCards] = useState<MemoryCard[]>([])

  const updateCards = useSessionStore((state) => state.updateCards)
  const increaseFlips = useSessionStore((state) => state.increaseFlips)
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
    if (flippedCards.length === 2 || clickedCard.isMatched) return
    increaseFlips()
    
    let updatedCards = clientSession.cards.map((card) =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    )
    updateCards(updatedCards)

    const flipped = [...flippedCards, clickedCard]
    setFlippedCards(flipped)

    if (flipped.length < 2) return

    if (flipped[0].key === flipped[1].key) {
      setTimeout(() => {
        updatedCards = updatedCards.map(
          (card) => card.key === flipped[0].key
            ? { ...card, isMatched: true }
            : card
        )

        updateCards(updatedCards)
        setFlippedCards([])
      }, 1000)
    } else {
      setTimeout(() => {
        updatedCards = updatedCards.map((card) =>
          flipped.some(fc => fc.id === card.id)
            ? { ...card, isFlipped: false }
            : card
        )

        updateCards(updatedCards)
        setFlippedCards([])
      }, 1000)
    }
  }

  /**
   * Handle session updates and game completion.
   * 
   * - Ends the game if all cards are matched.
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
