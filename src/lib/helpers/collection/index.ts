// prisma
import type { MemoryCard } from "@prisma/client"

/**
 * Pairs session cards with their corresponding image URLs from a card collection.
 * 
 * - Maps `collectionCards` to create a lookup object (`urlsMap`) where each card's ID corresponds to its image URL.
 * - Iterates over `sessionCards` and adds the matching `imageUrl` from `urlsMap` to each card object.
 * - Returns an array of `ClientSessionCard` objects, where each session card is enriched with the associated `imageUrl`.
 * 
 * @param {PrismaJson.SessionCard[]} sessionCards - The session cards that require image URLs.
 * @param {Pick<MemoryCard, 'id' | 'imageUrl'>[]} collectionCards - The collection of memory cards with image URLs to match with session cards.
 * 
 * @returns {ClientSessionCard[]} - A list of session cards with added `imageUrl` fields for client display.
 */
export function pairSessionCardsWithCollection(
  sessionCards: PrismaJson.SessionCard[],
  collectionCards: Pick<MemoryCard, 'id' | 'imageUrl'>[]
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

/** Server exports */
export {
  parseSchemaToClientCollection,
  parseCollectionFilter
} from "./server"

/** Uploadthing exports */
export {
  getCollectionImageSettings
} from "./uploadthing"
