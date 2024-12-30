// types
import type { z } from "zod"
import type { Prisma } from "@prisma/client"
import type { ClientMemoryCard, ClientCardCollection } from "@/lib/types/client"
import type { CardCollectionWithCardsWithUser } from "@/lib/types/prisma"

// schemas
import { collectionFilterSchema } from "@/lib/schema/query/collection-query"

// utils
import { pickFields } from "@/lib/util/parser"
import { clientUserKeys } from "@/lib/util/parser/user-parser"

/* Schema parser keys */
export const clientCardCollectionKeys: (keyof ClientCardCollection)[] = [
  'id', 'name', 'description', 'tableSize', 'cards',
  'user', 'createdAt', 'updatedAt'
] as const

export const clientMemoryCardKeys: (keyof ClientMemoryCard)[] = [
  'id', 'imageUrl'
]

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
 * Parses the input filter to generate a Prisma query condition for filtering card collections.
 * 
 * - Constructs a `Prisma.CardCollectionWhereInput` object to match collections based on the given username, name, and table size.
 * - Supports partial matches for the `username` and `name` fields.
 * 
 * @param {z.infer<typeof collectionFilterSchema>} filterInput - An input object based on `collectionFilterSchema`, containing filter criteria for collections.
 * 
 * @returns {Prisma.CardCollectionWhereInput} - A Prisma filter object for querying card collections by username, name, and table size.
 */
export function parseCollectionFilter(
  filterInput: z.infer<typeof collectionFilterSchema>
): Prisma.CardCollectionWhereInput {
  const { success, data: filter } = collectionFilterSchema.safeParse(filterInput)

  if (!success) return {}
  const { username, name, tableSize } = filter

  return {
    user: {
      username: { contains: username }
    },
    name: { contains: name },
    tableSize
  }
}
