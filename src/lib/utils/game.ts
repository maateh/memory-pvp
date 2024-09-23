import { v4 as uuidv4 } from "uuid"
import { intervalToDuration } from "date-fns"

// types
import type { TableSize } from "@prisma/client"

// constants
import { baseCardUrl, tableSizeMap } from "@/constants/game"

export function formatTimer(timerInMs: number): string {
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

export function getMockCards(tableSize: TableSize): MemoryCard[] {
  const cardsMap: Record<string, MemoryCard> = {}

  for (let i = 0; i < tableSizeMap[tableSize] / 2; i++) {
    /**
     * Approximately, the maximum image placeholder
     * capacity of the 'picsum.photos' API.
     */
    const placeholderCapacity = 1000
    const key = Math.floor(Math.random() * placeholderCapacity).toString()

    if (cardsMap[key]) {
      i--
      continue
    }

    cardsMap[key] = {
      id: uuidv4(),
      key,
      imageUrl: `${baseCardUrl}/${key}/640/640`,
      isFlipped: false,
      isMatched: false
    }
  }

  const cards = Object.values(cardsMap).reduce((cards, card) => ([
    ...cards,
    ...[card, { ...card, id: uuidv4() }]
  ]), [] as MemoryCard[])

  return cards.sort(() => Math.random() - 0.5)
}
