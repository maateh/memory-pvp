import { v4 as uuidv4 } from "uuid"
import { intervalToDuration } from "date-fns"

// types
import type { TableSize } from "@prisma/client"
import type { MemoryCard } from "@/hooks/store/use-session-store"

// constants
import { tableSizeMap } from "@/constants/game"

export function formatTimer(timerInMs: number) {
  const duration = intervalToDuration({
    start: 0,
    end: timerInMs
  })

  const zeroPad = (num: number | undefined) => String(num).padStart(2, '0')

  const hours = duration.hours ? zeroPad(duration.hours) : '00'
  const minutes = duration.minutes ? zeroPad(duration.minutes) : '00'
  const seconds = duration.seconds ? zeroPad(duration.seconds) : '00'

  if (duration.hours) return `${hours}:${minutes}:${seconds}`
  return `${minutes}:${seconds}`
}

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
