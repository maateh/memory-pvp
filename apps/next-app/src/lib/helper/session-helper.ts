import { nanoid } from "nanoid"

// types
import type { MemoryCard, TableSize } from "@repo/db"
import type { CardCollectionWithCardsWithUser } from "@repo/db/types"
import type { ClientCardCollection } from "@repo/schema/collection"
import type {
  ClientSessionCard,
  SessionSettings
} from "@repo/schema/session"

// server
import { db } from "@repo/server/db"
import { ServerError } from "@repo/server/error"

// config
import { tableSizeMap } from "@repo/config/game"

/**
 * Generates a unique session slug based on the provided session settings.
 *
 * The slug consists of a prefix derived from the first letter of `mode`, `format`, 
 * and `tableSize`, followed by a unique identifier. The identifier is an 8-character 
 * string from `nanoid`, with `_` and `-` replaced by `x` to ensure compatibility.
 *
 * @param {SessionSettings} settings The session settings containing `mode`, `format`, and `tableSize`.
 * @returns {string} A unique session slug string.
 */
export function generateSessionSlug(
  settings: Pick<SessionSettings, "mode" | "format" | "tableSize">
): string {
  const { mode, format, tableSize } = settings

  const prefix = `${mode[0].toLowerCase()}${format[0].toLowerCase()}${tableSize[0].toLowerCase()}`

  /* Prevents generating `_` symbol by nanoid. */
  const id = nanoid(8).replace(/[_-]/g, "x")
  return `${prefix}_${id}`
}

/**
 * Generates an array of shuffled session cards from a given card collection for use in a game session.
 * 
 * - Selects a random subset of cards from the provided collection, based on half the collection's `tableSize` to ensure matched pairs.
 * - Duplicates each card, assigning unique keys to create pairs, and initializes `matchedBy` as `null`.
 * - Returns a shuffled array of session cards for randomized placement on the game board.
 * 
 * @param {ClientCardCollection} collection - The card collection used to generate session cards, containing a list of memory cards.
 * 
 * @returns {PrismaJson.SessionCard[]} - Array of session cards, each duplicated and shuffled for game use.
 */
export function generateSessionCards(
  collection: ClientCardCollection,
  tableSize: TableSize
): PrismaJson.SessionCard[] {
  const randomCards = collection.cards
    .sort(() => Math.random() - 0.5)
    .slice(0, tableSizeMap[tableSize] / 2)

  const sessionCards = randomCards.reduce((cards, card, index) => {
    const firstKey = index * 2
    const secondKey = index * 2 + 1

    return [
      ...cards,
      { key: firstKey, id: card.id, matchedBy: null },
      { key: secondKey, id: card.id, matchedBy: null }
    ] satisfies PrismaJson.SessionCard[]
  }, [] as PrismaJson.SessionCard[])

  return sessionCards.sort(() => Math.random() - 0.5)
}

/**
 * Pairs session cards with their corresponding image URLs from a card collection.
 * 
 * - Maps `collectionCards` to create a lookup object (`urlsMap`) where each card's ID corresponds to its image URL.
 * - Iterates over `sessionCards` and adds the matching `imageUrl` from `urlsMap` to each card object.
 * - Returns an array of `ClientSessionCard` objects, where each session card is enriched with the associated `imageUrl`.
 * 
 * @param {PrismaJson.SessionCard[]} sessionCards - The session cards that require image URLs.
 * @param {Pick<MemoryCard, 'id' | 'imageUrl'>[]} collectionCards - The collection of memory cards with image URLs to match with session cards.
 * 
 * @returns {ClientSessionCard[]} - A list of session cards with added `imageUrl` fields for client display.
 */
export function pairSessionCardsWithCollection(
  sessionCards: PrismaJson.SessionCard[],
  collectionCards: Pick<MemoryCard, 'id' | 'imageUrl'>[]
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
 * Verifies if a card collection exists and is compatible with the specified table size.
 * 
 * This function retrieves a card collection by `collectionId` and ensures it meets 
 * the table size requirements set in `settings`. If the collection is not found 
 * or its table size is smaller than required, an error is thrown.
 * 
 * @param {SessionSettings} settings The session settings containing `collectionId` and `tableSize`.
 * @returns {Promise<CardCollectionWithCardsWithUser>} The card collection with its associated cards and user.
 * @throws {ServerError} If the collection is not found (`COLLECTION_NOT_FOUND`).
 * @throws {ServerError} If the collection's table size is too small (`TABLE_SIZE_CONFLICT`).
 */
export async function verifyCollectionInAction(
  settings: Pick<SessionSettings, "collectionId" | "tableSize">
): Promise<CardCollectionWithCardsWithUser> {
  const { collectionId, tableSize } = settings

  /* Finding collection with the specified `collectionId` */
  const collection = await db.cardCollection.findUnique({
    where: { id: collectionId },
    include: { user: true, cards: true }
  })

  /**
   * Throws server error with `COLLECTION_NOT_FOUND` key if
   * collection not found with the specified `collectionId`.
   */
  if (!collection) {
    ServerError.throwInAction({
      key: "COLLECTION_NOT_FOUND",
      message: "Sorry, but we can't find the card collection you selected.",
      description: "Please, select another collection or try again later."
    })
  }

  /**
   * Throws server error with `TABLE_SIZE_CONFLICT` key if
   * collection and settings table sizes are incompatible.
   */
  if (tableSizeMap[tableSize] > tableSizeMap[collection.tableSize]) {
    ServerError.throwInAction({
      key: "TABLE_SIZE_CONFLICT",
      message: "Collection table size is too small.",
      description: "Table size of the selected collection is incompatible with your settings."
    })
  }

  return collection
}
