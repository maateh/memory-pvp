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
 * Retrieves a card collection by ID with optional access control.
 * 
 * @param {string} id The ID of the card collection to retrieve.
 * @param {("public" | "protected")} [access="public"] The access level required for retrieving the collection.
 * @returns {Promise<ClientCardCollection | null>} Client-safe card collection or `null` if not found.
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
 * Retrieves a paginated list of card collections based on search filters and access level.
 * 
 * @param {Partial<Search<CollectionFilter, CollectionSort>>} search Search object containing filter, sort, and pagination parameters.
 * @param {("public" | "protected")} [access="public"] The access level required for retrieving collections.
 * @returns {Promise<Pagination<ClientCardCollection>>} Paginated list of client-safe card collections.
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
    include: { user: true, cards: true }
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
 * @param {TableSize} tableSize The required table size for the card collection.
 * @returns {Promise<ClientCardCollection | null>} A randomly selected card collection, or `null` if no match is found.
 */
export async function getRandomCollection(
  tableSize: TableSize
): Promise<ClientCardCollection | null> {
  const count = await db.cardCollection.count({ where: { tableSize } })
  const randomSkip = Math.floor(Math.random() * count)

  const collection = await db.cardCollection.findFirst({
    where: { tableSize },
    include: { user: true, cards: true },
    skip: randomSkip
  })

  if (!collection) return null
  return parseSchemaToClientCollection(collection)
}
