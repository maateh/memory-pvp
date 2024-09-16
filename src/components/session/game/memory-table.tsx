"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

// utils
import { cn } from "@/lib/utils"

// types
import type { GameSessionClient, MemoryCard as TMemoryCard } from "@/hooks/use-game-store"

// components
import MemoryCard from "./memory-card"

type MemoryTableProps = {
  session: GameSessionClient
  updateCards: (cards: TMemoryCard[]) => Promise<void> | void
}

const MemoryTable = ({ session, updateCards }: MemoryTableProps) => {
  const router = useRouter()

  const [flippedCards, setFlippedCards] = useState<TMemoryCard[]>([])

  const handleCardFlip = (clickedCard: TMemoryCard) => {
    if (flippedCards.length === 2 || clickedCard.isMatched) return

    const updatedCards = session.cards.map((card) =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    )
    updateCards(updatedCards)

    const newFlippedCards = [...flippedCards, clickedCard]
    setFlippedCards(newFlippedCards)

    if (newFlippedCards.length === 2) {
      if (newFlippedCards[0].key === newFlippedCards[1].key) {
        setTimeout(() => {
          const updatedCards = session.cards.map((card) =>
            card.key === newFlippedCards[0].key
              ? { ...card, isFlipped: true, isMatched: true }
              : card
          )

          updateCards(updatedCards)
          setFlippedCards([])
        }, 1000)
      } else {
        setTimeout(() => {
          const updatedCards = session.cards.map((card) =>
            newFlippedCards.some(fc => fc.id === card.id)
              ? { ...card, isFlipped: false }
              : card
          )

          updateCards(updatedCards)
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  useEffect(() => {
    if (session.cards.every(card => card.isMatched)) {
      router.replace('/game/offline/summary')
    }
  }, [session.cards, router])

  return (
    <div className="flex-1 w-full p-4 flex justify-center items-center">
      <div className={cn("grid gap-4 w-full grid-cols-3", {
        "max-w-3xl md:grid-cols-4": session.tableSize === 'SMALL',
        "max-w-5xl sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6": session.tableSize === 'MEDIUM',
        "max-w-7xl sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8": session.tableSize === 'LARGE'
      }
      )}>
        {session.cards.map((card) => (
          <MemoryCard
            card={card}
            onClick={() => handleCardFlip(card)}
            key={card.id}
          />
        ))}
      </div>
    </div>
  )
}

export default MemoryTable
