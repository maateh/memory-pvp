import { useEffect, useState } from "react"
import { redirect } from "next/navigation"

// hooks
import { type MemoryCard, useSessionStore } from "@/hooks/store/use-session-store"
import { useOfflineSessionHandler } from "@/hooks/handler/session/use-offline-session-handler"

export const useOfflineGameHandler = () => {
  /** Check if there is any client session. */
  const clientSession = useSessionStore((state) => state.session)
  if (!clientSession) redirect('/game/setup')

  /** Get custom handler to finish the game. */
  const { finishOfflineSession } = useOfflineSessionHandler()

  /** Initialize required states and handlers for the game. */
  const [cards, setCards] = useState<MemoryCard[]>(clientSession.cards)
  const [flippedCards, setFlippedCards] = useState<MemoryCard[]>([])
  
  const updateSessionCards = useSessionStore((state) => state.updateCards)
  const increaseSessionFlips = useSessionStore((state) => state.increaseFlips)

  const handleCardFlip = (clickedCard: MemoryCard) => {
    if (flippedCards.length === 2 || clickedCard.isMatched) return
    increaseSessionFlips()
    
    const updatedCards = cards.map((card) =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    )
    setCards(updatedCards)

    const flipped = [...flippedCards, clickedCard]
    setFlippedCards(flipped)

    if (flipped.length < 2) return

    if (flipped[0].key === flipped[1].key) {
      setTimeout(() => {
        setCards((cards) => {
          const updatedCards = cards.map(
            (card) => card.key === flipped[0].key ? { ...card, isMatched: true } : card
          )
          updateSessionCards(updatedCards)
          return updatedCards
        })

        setFlippedCards([])
      }, 1000)
    } else {
      setTimeout(() => {
        setCards((cards) => (
          cards.map((card) =>
            flipped.some(fc => fc.id === card.id)
              ? { ...card, isFlipped: false }
              : card
          )
        ))

        setFlippedCards([])
      }, 1000)
    }
  }

  useEffect(() => {
    if (cards.every(card => card.isMatched)) {
      finishOfflineSession('FINISHED')
    }
  }, [cards, finishOfflineSession])

  return { clientSession, cards, handleCardFlip }
}
