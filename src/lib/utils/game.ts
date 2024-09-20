import { v4 as uuidv4 } from "uuid"

// types
import type { TableSize } from "@prisma/client"
import type { MemoryCard } from "@/hooks/store/use-session-store"

// constants
import { tableSizeMap } from "@/constants/game"

export const getMockCards = (tableSize: TableSize): MemoryCard[] => {
  const cards: MemoryCard[] = []

  for (let i = 0; i < tableSizeMap[tableSize] / 2; i++) {
    const card = {
      id: uuidv4(),
      key: `card-${i}`,
      imageUrl: `/`, // TODO: upload cards
      isFlipped: false,
      isMatched: false
    }
    cards.push(card, { ...card, id: uuidv4() })
  }
  return cards.sort(() => Math.random() - 0.5)
}
