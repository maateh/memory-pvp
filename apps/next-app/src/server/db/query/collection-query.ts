// types
import type { TableSize } from "@repo/db"
import type { ClientCardCollection, CollectionFilter, CollectionSort } from "@repo/schema/collection"
import type { Pagination } from "@repo/schema/search"
import type { Search } from "@/lib/types/search"

// schema
import { collectionSort } from "@repo/schema/collection"

// db
import { db } from "@repo/server/db"

// actions
import { signedIn } from "@/server/action/user-action"

// helpers
import {
  parseCollectionFilterToWhere,
  parseSchemaToClientCollection
} from "@/lib/util/parser/collection-parser"

// utils
import { paginate, paginationWrapper } from "@/lib/util/parser/pagination-parser"
import { parseSortToOrderBy } from "@/lib/util/parser/search-parser"

/**
 * TODO: rewrite doc
 * 
 * @param id 
 * @param access 
 * @returns 
 */
export async function getCollection(
  id: string,
  access: "public" | "protected" = "public"
): Promise<ClientCardCollection | null> {
  if (access === "protected") {
    const user = await signedIn()
    if (!user) return null
  }

  const collection = await db.cardCollection.findUnique({
    where: { id },
    include: { user: true, cards: true }
  })

  if (!collection) return null
  return parseSchemaToClientCollection(collection)
}

/**
 * TODO: rewrite doc
 * 
 * @param search 
 * @returns 
 */
export async function getCollections(
  search: Partial<Search<CollectionFilter, CollectionSort>>,
  access: "public" | "protected" = "public"
): Promise<Pagination<ClientCardCollection>> {
  const { filter, sort, pagination } = search

  const user = access === "protected" || filter?.excludeUser ? await signedIn() : null
  const where = parseCollectionFilterToWhere({ ...filter, userId: user?.id })

  const total = await db.cardCollection.count({ where })
  const collections = await db.cardCollection.findMany({
    ...paginate(pagination),
    where,
    orderBy: parseSortToOrderBy(sort, collectionSort, { createdAt: "desc" }),
    include: {
      user: true,
      cards: true
    }
  })

  const clientCollections = collections.map((collection) => parseSchemaToClientCollection(collection))
  return paginationWrapper(clientCollections, total, pagination)
}

/**
 * Retrieves a random card collection of a specified table size from the database.
 * 
 * - Counts the total number of collections in the database to calculate a random offset.
 * - Selects a collection that matches the specified `tableSize`, skipping a random number of records for randomness.
 * - If no collections match the criteria, returns `null`.
 * 
 * @param {TableSize} tableSize - The required table size for the card collection.
 * @returns {Promise<ClientCardCollection | null>} - A randomly selected card collection including its cards, or `null` if no match is found.
 */
export async function getRandomCollection(
  tableSize: TableSize
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
