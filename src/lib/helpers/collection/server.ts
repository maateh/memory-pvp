// types
import type { MemoryCard } from "@prisma/client"

// constants
import { clientCardCollectionKeys } from "@/constants/collection"

// utils
import { pickFields } from "@/lib/utils"

/**
 * TODO: write doc
 * 
 * @param collection 
 * @returns 
 */
export function parseSchemaToClientCollection(
  collection: CardCollectionWithCardsWithUser
): ClientCardCollection {
  return pickFields(collection, clientCardCollectionKeys)
}

/**
 * TODO: write doc
 * 
 * @param sessionCards 
 * @param collection 
 */
export function pairSessionCardsWithCollection(
  sessionCards: PrismaJson.SessionCard[],
  collectionCards: MemoryCard[]
): ClientSessionCard[] {
  const urlsMap = collectionCards.reduce((urlsMap, card) => ({
    ...urlsMap,
    [card.id]: card.imageUrl
  }), {} as Record<string, string>)

  const cards = sessionCards.map((card) => ({
    ...card,
    imageUrl: urlsMap[card.id]
  }))

  return cards
}
