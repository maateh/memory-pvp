// types
import type { z } from "zod"
import type { Prisma } from "@prisma/client"
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
