// types
import type { z } from "zod"
import type { TableSize } from "@prisma/client"
import type { collectionFilterSchema, collectionSortSchema } from "@/lib/schema/param/collection-param"

// server
import { db } from "@/server/db"
import { signedIn } from "@/server/action/user-action"

// helpers
import { parseCollectionFilter, parseSchemaToClientCollection } from "@/lib/util/parser/collection-parser"

// utils
import { parseSortToOrderBy } from "@/lib/util/parser"

/**
 * Retrieves a specific card collection by its ID and parses it into a `ClientCardCollection`.
 * 
 * - If `userProtected` is enabled, ensures that a user is signed in before fetching the collection.
 * - Fetches the collection with its associated user and cards data.
 * - Returns `null` if the collection is not found or if the user is not signed in when `userProtected` is `true`.
 * 
 * @param {Object} options - Options for retrieving the collection.
 * @param {string} options.id - The ID of the collection to retrieve.
 * @param {boolean} [options.userProtected=true] - Whether to require the user to be signed in to fetch the collection.
 * @returns {Promise<ClientCardCollection | null>} - The parsed collection or `null` if not found.
 */
export async function getCollection({ id, userProtected = true }: {
  id: string
  userProtected?: boolean
}): Promise<ClientCardCollection | null> {
  if (userProtected) {
    const user = await signedIn()
    if (!user) return null
  }

  const collection = await db.cardCollection.findUnique({
    where: { id },
    include: {
      user: true,
      cards: true
    }
  })

  if (!collection) return null
  return parseSchemaToClientCollection(collection)
}

/**
 * Retrieves a list of card collections based on the specified filter and sorting options.
 * 
 * - Parses and applies filter criteria from `input.filter`.
 * - Sorts the results according to the specified `sort` parameter.
 * - Excludes collections created by the signed-in user if `includeUser` is `false`.
 * 
 * @param {Object} input - The input object containing filter, sort, and pagination options.
 * @returns {Promise<ClientCardCollection[]>} - A list of card collections matching the filter and sorting criteria.
 */
export async function getCollections({ filter, sort }: {
  filter: z.infer<typeof collectionFilterSchema>
  sort: z.infer<typeof collectionSortSchema>
  // pagination: z.infer<typeof paginationSchema> TODO: implement
}): Promise<ClientCardCollection[]> {
  const where = parseCollectionFilter(filter)

  if (!filter.includeUser) {
    const user = await signedIn()
    where.NOT = { userId: user?.id }
  }

  const collections = await db.cardCollection.findMany({
    where,
    orderBy: parseSortToOrderBy(sort) || {
      createdAt: 'desc'
    },
    include: {
      user: true,
      cards: true
    }
  })

  return collections.map((collection) => parseSchemaToClientCollection(collection))
}

/**
 * Retrieves a list of card collections for the signed-in user, sorted as specified and parsed into `ClientCardCollection` instances.
 * 
 * - Fetches collections from the database for the signed-in user.
 * - Returns an empty array if no user is signed in.
 * - Orders collections by the specified `sort` criteria or by creation date in descending order if no sort criteria are provided.
 * - Includes user and cards data for each collection, then converts each collection to the `ClientCardCollection` format.
 * 
 * @param {z.infer<typeof collectionSortSchema>} [sort={}] - The sorting criteria for ordering collections.
 * @returns {Promise<ClientCardCollection[]>} - An array of parsed collections, or an empty array if no user is signed in.
 */
export async function getUserCollections({ sort }: {
  sort: z.infer<typeof collectionSortSchema>
}): Promise<ClientCardCollection[]> {
  const user = await signedIn()
  if (!user) return []

  const collections = await db.cardCollection.findMany({
    where: {
      userId: user.id
    },
    orderBy: parseSortToOrderBy(sort) || {
      createdAt: 'desc'
    },
    include: {
      user: true,
      cards: true
    }
  })

  return collections.map((collection) => parseSchemaToClientCollection(collection))
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
 * @returns {Promise<ClientCardCollection | null>} - A randomly selected card collection including its cards, or `null` if no match is found.
 */
export async function getRandomCollection(
  tableSize: TableSize = 'SMALL'
): Promise<ClientCardCollection | null> {
  const count = await db.cardCollection.count()
  const randomSkip = Math.floor(Math.random() * count)

  const collection = await db.cardCollection.findFirst({
    where: { tableSize },
    include: {
      user: true,
      cards: true
    },
    skip: randomSkip
  })

  if (!collection) return null
  return parseSchemaToClientCollection(collection)
}
