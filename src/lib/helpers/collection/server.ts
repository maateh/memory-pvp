// server
import { db } from "@/server/db"

// types
import type { z } from "zod"
import type { MemoryCard, Prisma, TableSize } from "@prisma/client"
import type { collectionFilterSchema } from "@/lib/validations/collection-schema"

// constants
import { clientCardCollectionKeys, clientMemoryCardKeys } from "@/constants/collection"
import { clientUserKeys } from "@/constants/user"

// utils
import { pickFields } from "@/lib/utils"

/**
 * Transforms a prisma schema object into a `ClientCardCollection` format, including only relevant fields for the client.
 * 
 * - Filters the `collection` object to include only fields specified in `clientCardCollectionKeys` constant.
 * - Extracts the user information within the collection using `clientUserKeys`.
 * - Maps through each card in the collection and filters to include fields specified in `clientMemoryCardKeys`.
 * - Returns a new `ClientCardCollection` object containing the filtered collection data, user information, and cards.
 * 
 * @param {CardCollectionWithCardsWithUser} collection - The card collection schema with cards and user data to transform.
 * 
 * @returns {ClientCardCollection} - The transformed collection object ready for client-side usage.
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
 * @param userId 
 * @param filterInput 
 * @returns 
 */
export function parseCollectionFilter(
  filterInput: z.infer<typeof collectionFilterSchema>
): Prisma.CardCollectionWhereInput {
  const { username, name, tableSize } = filterInput

  return {
    user: {
      username: { contains: username }
    },
    name: { contains: name },
    tableSize
  }
}

/**
 * Pairs session cards with their corresponding image URLs from a card collection.
 * 
 * - Maps `collectionCards` to create a lookup object (`urlsMap`) where each card's ID corresponds to its image URL.
 * - Iterates over `sessionCards` and adds the matching `imageUrl` from `urlsMap` to each card object.
 * - Returns an array of `ClientSessionCard` objects, where each session card is enriched with the associated `imageUrl`.
 * 
 * @param {PrismaJson.SessionCard[]} sessionCards - The session cards that require image URLs.
 * @param {MemoryCard[]} collectionCards - The collection of memory cards with image URLs to match with session cards.
 * 
 * @returns {ClientSessionCard[]} - A list of session cards with added `imageUrl` fields for client display.
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
 * Retrieves a random card collection of a specified table size from the database.
 * 
 * - Counts the total number of collections in the database to calculate a random offset.
 * - Selects a collection that matches the specified `tableSize`, skipping a random number of records for randomness.
 * - If no collections match the criteria, returns `null`.
 * 
 * @param {TableSize} tableSize - The required table size for the card collection.
 * 
 * @returns {Promise<CardCollectionWithCards | null>} - A randomly selected card collection including its cards, or `null` if no match is found.
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
