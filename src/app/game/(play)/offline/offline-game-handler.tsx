"use client"

import { useEffect, useState } from "react"
import { redirect } from "next/navigation"

// constants
import { offlineSessionMetadata } from "@/constants/game"

// components
import { SessionHeader } from "@/components/session"
import { MemoryTable } from "@/components/session/game"

// hooks
import { type MemoryCard, useGameStore } from "@/hooks/use-game-store"
import { useOfflineSessionHandler } from "@/hooks/use-offline-session-handler"

const OfflineGameHandler = () => {
  /** Check if there is any client session. */
  const clientSession = useGameStore((state) => state.session)
  if (!clientSession) redirect('/game/setup')

  /** Get custom handler to finish the game. */
  const { finishOfflineSession } = useOfflineSessionHandler()

  /** Initialize required states and handlers for the game. */
  const [cards, setCards] = useState<MemoryCard[]>(clientSession.cards)
  const [flippedCards, setFlippedCards] = useState<MemoryCard[]>([])
  
  const updateSessionCards = useGameStore((state) => state.updateCards)
  const increaseSessionFlips = useGameStore((state) => state.increaseFlips)

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

  return (
    <>
      <SessionHeader
        session={{
          ...clientSession,
          ...offlineSessionMetadata
        }}
      />

      <MemoryTable
        session={{
          ...clientSession,
          ...offlineSessionMetadata,
          cards
        }}
        handleCardFlip={handleCardFlip}
      />
    </>
  )
}

export default OfflineGameHandler
