"use server"

// types
import type { z } from "zod"
import type { TableSize } from "@prisma/client"
import type { collectionSortSchema, getCollectionsSchema } from "@/lib/validations/collection-schema"

// server
import { db } from "@/server/db"
import { signedIn } from "@/server/actions/signed-in"

// helpers
import { parseCollectionFilter, parseSchemaToClientCollection } from "@/lib/helpers/collection"

/**
 * TODO: write doc
 * 
 * @param input 
 * @returns 
 */
export async function getCollections(
  input: z.infer<typeof getCollectionsSchema>
): Promise<ClientCardCollection[]> {
  const filter = parseCollectionFilter(input.filter)
  const { sort, includeUser } = input

  if (!includeUser) {
    const user = await signedIn()
    filter.NOT = { userId: user?.id }
  }

  const collections = await db.cardCollection.findMany({
    where: filter,
    orderBy: sort,
    include: {
      user: true,
      cards: true
    }
  })

  return collections.map((collection) => parseSchemaToClientCollection(collection))
}

/**
 * Retrieves a list of card collections for the signed-in user and parses them into `ClientCardCollection` instances.
 * 
 * - Fetches collections from the database where the `userId` matches the signed-in user's ID.
 * - Returns an empty array if no user is signed in.
 * - Orders the collections by creation date in descending order.
 * - Includes the user and cards data for each collection, then converts each collection to the `ClientCardCollection` format.
 * 
 * @returns {Promise<ClientCardCollection[]>} - An array of parsed collections, or an empty array if no user is signed in.
 */
export async function getUserCollections(
  sort: z.infer<typeof collectionSortSchema> = {}
): Promise<ClientCardCollection[]> {
  const user = await signedIn()
  if (!user) return []

  const collections = await db.cardCollection.findMany({
    where: {
      userId: user.id
    },
    orderBy: Object.keys(sort).length > 0 ? sort : {
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
