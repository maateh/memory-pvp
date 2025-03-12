// types
import type { Prisma } from "@repo/db"
import type {
  ClientSession,
  ClientSessionVariants,
  OfflineClientSession,
  OfflineSessionStorage
} from "@repo/schema/session"
import type { SessionFilterQuery } from "@/lib/schema/query/session-query"
import type { GameSessionWithPlayersWithAvatarWithCollectionWithCards } from "@repo/db/types"

// schemas
import { sessionFilterQuery } from "@/lib/schema/query/session-query"

// config
import { getFallbackCollection } from "@/config/collection-settings"
import { deletedPlayerPlaceholder } from "@/config/player-settings"

// helpers
import { pairSessionCardsWithCollection } from "@/lib/helper/session-helper"

// utils
import { parseSchemaToClientPlayer } from "@/lib/util/parser/player-parser"
import { pickFields } from "@/lib/util/parser"

/* Schema parser keys */
export const clientSessionKeys: (keyof ClientSession)[] = [
  'slug', 'collectionId',
  'owner', 'guest',
  'status', 'mode', 'format', 'tableSize',
  'stats', 'flipped', 'cards', 'currentTurn',
  'startedAt', 'updatedAt', 'closedAt'
] as const

export const offlineSessionStorageKeys: (keyof OfflineSessionStorage)[] = [
  'collectionId', 'tableSize',
  'stats',
  'flipped', 'cards',
  'startedAt', 'updatedAt'
] as const

/**
 * Parses a `GameSessionWithOwnerWithPlayersWithAvatar` schema into a `ClientSession`.
 * 
 * @param {GameSessionWithPlayersWithAvatarWithCollectionWithCards} session - The full session data including players and avatars.
 * @returns {ClientSessionVariants} - A parsed session with player data structured into `current` and `other` fields.
 */
export function parseSchemaToClientSession(
  session: GameSessionWithPlayersWithAvatarWithCollectionWithCards
): ClientSessionVariants {
  const filteredSession = pickFields(session, clientSessionKeys)
  const sessionCollection = session.collection ?? getFallbackCollection(session.tableSize)

  const { format, mode, ...clientSession }: Omit<ClientSession, "guest"> = {
    ...filteredSession,
    collectionId: sessionCollection.id,
    cards: pairSessionCardsWithCollection(session.cards, sessionCollection.cards),
    owner: session.owner
      ? parseSchemaToClientPlayer(session.owner)
      : deletedPlayerPlaceholder
  }

  if (format === "OFFLINE") {
    return { ...clientSession, format, mode: "CASUAL" }
  }

  if (format === "SOLO") {
    return { ...clientSession, format, mode }
  }

  return {
    ...clientSession,
    format,
    mode,
    guest: session.guest
      ? parseSchemaToClientPlayer(session.guest)
      : deletedPlayerPlaceholder
  }
}

/**
 * Parses the provided session filter input to create a `Prisma.GameSessionWhereInput` object, 
 * which can be used to query game sessions using Prisma.
 * 
 * - Filters sessions by the owner's user ID and optionally by players and stats.
 * - If `players` are provided in the input, it checks whether any of the players in the session 
 *   have a matching tag from the input.
 * - Filters session stats if provided in the input.
 * 
 * @param {string} userId - The ID of the session owner to filter by.
 * @param {SessionFilterQuery} filterInput - The filter input that includes optional player and stats filters.
 * 
 * @returns {Prisma.GameSessionWhereInput} - A Prisma query input for filtering game sessions.
 */
export function parseSessionFilter(
  userId: string,
  filterInput: SessionFilterQuery
): Prisma.GameSessionWhereInput {
  const where: Prisma.GameSessionWhereInput = {
    OR: [
      { owner: { userId } },
      { guest: { userId } }
    ]
  }

  const { success, data: filter } = sessionFilterQuery.safeParse(filterInput)
  if (!success) return where

  if (filter.playerId) {
    where.OR = [
      { ownerId: filter.playerId },
      { guestId: filter.playerId }
    ]
    delete filter.playerId
  }

  return { ...where, ...filter }
}
