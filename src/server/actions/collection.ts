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

// utils
import { parseSortToOrderBy } from "@/lib/utils"

/**
 * Retrieves a list of card collections based on the specified filter and sorting options.
 * 
 * - Parses and applies filter criteria from `input.filter`.
 * - Sorts the results according to the specified `sort` parameter.
 * - Excludes collections created by the signed-in user if `includeUser` is `false`.
 * 
 * @param {z.infer<typeof getCollectionsSchema>} input - The input object containing filter, sort, and user inclusion options.
 * @returns {Promise<ClientCardCollection[]>} - A list of card collections matching the filter and sorting criteria.
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
export async function getUserCollections(
  sort: z.infer<typeof collectionSortSchema> = {}
): Promise<ClientCardCollection[]> {
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
