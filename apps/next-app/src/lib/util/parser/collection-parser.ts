// types
import type { Prisma } from "@repo/db"
import type { CardCollectionWithCardsWithUser } from "@repo/db/types"
import type {
  ClientMemoryCard,
  ClientCardCollection,
  CollectionFilter
} from "@repo/schema/collection"

// schemas
import { collectionFilter } from "@repo/schema/collection"

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
 * @param {CardCollectionWithCardsWithUser} collection The card collection schema with cards and user data to transform.
 * @returns {ClientCardCollection} The transformed collection object ready for client-side usage.
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
 * Parses `CollectionFilter` into a Prisma `where` query for filtering card collections.
 * 
 * @param {CollectionFilter} filter Filter object containing filtering criteria.
 * @returns {Prisma.CardCollectionWhereInput} Prisma object for querying the database.
 */
export function parseCollectionFilterToWhere(
  filter: CollectionFilter
): Prisma.CardCollectionWhereInput {
  const { success, data } = collectionFilter.safeParse(filter)
  if (!success) return {}

  const { name, description, tableSize, userId, username, excludeUser } = data

  return {
    name: { contains: name },
    description: { contains: description },
    tableSize,
    user: { id: userId, username: { contains: username } },
    NOT: excludeUser ? { userId } : undefined
  }
}
