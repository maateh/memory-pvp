import { v4 as uuidv4 } from "uuid"
import { differenceInSeconds, intervalToDuration } from "date-fns"

// types
import type { TableSize } from "@prisma/client"

// constants
import { baseCardUrl, tableSizeMap } from "@/constants/game"

/**
 * Formats a timer value (in milliseconds) into a `HH:MM:SS` or `MM:SS` string.
 * 
 * @param {number} timerInMs - The timer value in milliseconds.
 * @returns {string} - The formatted time string.
 * 
 * - Pads hours, minutes, and seconds with leading zeros.
 * - If hours are present, returns `HH:MM:SS`. Otherwise, returns `MM:SS`.
 */
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

export function calculateSessionTimer({
  startedAt, continuedAt, timer
}: Pick<ClientGameSession, 'startedAt' | 'continuedAt' | 'timer'>): number {
  return differenceInSeconds(
    Date.now(),
    continuedAt || startedAt
  ) + timer
}

/**
 * Generates a shuffled array of memory card pairs based on the given table size.
 * 
 * Note: Currently, this is used only for testing purposes.
 * Received image placeholders might not even exist.
 * 
 * @param {TableSize} tableSize - The size of the card table.
 * @returns {PrismaJson.MemoryCard[]} - An array of randomly paired and shuffled memory cards.
 * 
 * - Generates unique keys for each card pair, using the 'picsum.photos' API for placeholder images.
 * - Ensures the card array is shuffled before returning.
 */
export function getMockCards(tableSize: TableSize): PrismaJson.MemoryCard[] {
  const cardsMap: Record<string, PrismaJson.MemoryCard> = {}

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
  ]), [] as PrismaJson.MemoryCard[])

  return cards.sort(() => Math.random() - 0.5)
}
