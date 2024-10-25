// server
import { db } from "@/server/db"

// types
import type { MemoryCard, TableSize } from "@prisma/client"

// constants
import { clientCardCollectionKeys, clientMemoryCardKeys } from "@/constants/collection"
import { clientUserKeys } from "@/constants/user"

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
  const filteredCollection = pickFields(collection, clientCardCollectionKeys)

  const user = pickFields(filteredCollection.user, clientUserKeys)
  const cards = filteredCollection.cards.map((card) => pickFields(card, clientMemoryCardKeys))

  return {
    ...filteredCollection,
    user,
    cards
  }
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

/**
 * TODO: write doc
 * 
 * @param tableSize 
 * @returns 
 */
export async function getRandomCollection(
  tableSize: TableSize
): Promise<CardCollectionWithCards | null> {
  const count = await db.cardCollection.count()
  const randomSkip = Math.floor(Math.random() * count)

  // TODO: (!) hasn't been tested yet
  return await db.cardCollection.findFirst({
    where: { tableSize },
    include: {
      cards: true
    },
    skip: randomSkip
  })
}
