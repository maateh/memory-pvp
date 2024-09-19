import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { TRPCApiError } from "@/trpc/error"
import { toast } from "sonner"

import { v4 as uuidv4 } from "uuid"
import { MemoryCard } from "@/hooks/store/use-session-store"
import { TableSize } from "@prisma/client"
import { tableSizeMap } from "@/constants/game"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function handleApiError(
  err: TRPCApiError | undefined,
  fallbackDescription?: string
) {
  if (err?.name === 'TRPCApiError') {
    toast.error(err.message, {
      description: err.description
    })
    return
  }

  toast.error('Something went wrong.', { description: fallbackDescription })
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
