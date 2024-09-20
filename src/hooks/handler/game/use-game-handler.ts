import { useEffect, useState } from "react"
import { redirect } from "next/navigation"

// utils
import { saveSessionToStorage } from "@/lib/utils/storage"

// hooks
import { useSessionStore, type MemoryCard } from "@/hooks/store/use-session-store"

type UseGameHandlerProps = {
  finishSession: () => void
}

export const useGameHandler = ({ finishSession }: UseGameHandlerProps) => {
  /** Check if there is any registered session. */
  const clientSession = useSessionStore((state) => state.session)
  if (!clientSession) redirect('/game/setup')

  /** Initialize required states and handlers for the game. */
  const [flippedCards, setFlippedCards] = useState<MemoryCard[]>([])

  const updateCards = useSessionStore((state) => state.updateCards)
  const increaseFlips = useSessionStore((state) => state.increaseFlips)
  const unregisterSession = useSessionStore((state) => state.unregister)

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
        updateCards(
          updatedCards.map((card) =>
            flipped.some(fc => fc.id === card.id)
              ? { ...card, isFlipped: false }
              : card
          )
        )

        setFlippedCards([])
      }, 1000)
    }
  }

  useEffect(() => {
    if (clientSession.status === 'OFFLINE') {
      saveSessionToStorage(clientSession)
    }

    const isOver = clientSession.cards.every(card => card.isMatched)
    if (!isOver) return

    unregisterSession()
    finishSession()
  }, [clientSession, unregisterSession, finishSession])

  return { clientSession, handleCardFlip }
}
