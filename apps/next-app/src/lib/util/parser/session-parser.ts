// types
import type { Prisma } from "@repo/db"
import type { GameSessionWithPlayersWithAvatarWithCollectionWithCards } from "@repo/db/types"
import type {
  ClientSession,
  ClientSessionVariants,
  OfflineSessionStorage,
  SessionFilter
} from "@repo/schema/session"

// schemas
import { sessionFilter } from "@repo/schema/session"

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
 * TODO: write doc
 * 
 * @param filter 
 * @param userId 
 * @returns 
 */
export function parseSessionFilterToWhere(
  filter: SessionFilter,
  userId: string
): Prisma.GameSessionWhereInput {
  const where: Prisma.GameSessionWhereInput = {
    OR: [
      { owner: { userId } },
      { guest: { userId } }
    ]
  }

  const { success, data } = sessionFilter.safeParse(filter)
  if (!success) return where

  const { playerId, ...parsedFilter } = data

  if (playerId) {
    where.OR = [
      { owner: { userId, id: playerId } },
      { guest: { userId, id: playerId } }
    ]
  }

  return { ...where, ...parsedFilter }
}
