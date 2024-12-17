// types
import type { z } from "zod"
import type { Prisma } from "@prisma/client"

// schemas
import { sessionFilterSchema } from "@/lib/schema/param/session-param"

// config
import { getFallbackCollection } from "@/config/collection-settings"
import { deletedPlayerPlaceholder } from "@/config/player-settings"

// helpers
import { pairSessionCardsWithCollection } from "@/lib/helper/session-helper"

// utils
import { parseSchemaToClientPlayer } from "@/lib/util/parser/player-parser"
import { pickFields } from "@/lib/util/parser"

/* Schema parser keys */
export const clientSessionKeys: (keyof ClientGameSession)[] = [
  'slug', 'collectionId',
  'players',
  'type', 'mode', 'tableSize', 'status',
  'stats', 'flipped', 'cards',
  'startedAt', 'continuedAt', 'closedAt'
] as const

export const offlineSessionKeys: (keyof UnsignedClientGameSession)[] = [
  'collectionId', 'players', 'tableSize',
  'stats', 'flipped', 'cards',
  'startedAt', 'continuedAt'
] as const

/**
 * Parses a `GameSessionWithOwnerWithPlayersWithAvatar` schema into a `ClientGameSession`, 
 * organizing player data based on the current player's ID.
 * 
 * - The `players` field is structured to have:
 *   - `current`: The player object whose ID matches the `currentPlayerId`.
 *   - `other`: The other player in the session.
 * 
 * @param {GameSessionWithPlayersWithAvatarWithCollectionWithCards} session - The full session data including players and avatars.
 * @param {string} currentPlayerId - The ID of the current player to identify them in the session.
 * @returns {ClientGameSession} - A parsed session with player data structured into `current` and `other` fields.
 */
export function parseSchemaToClientSession(
  session: GameSessionWithPlayersWithAvatarWithCollectionWithCards,
  currentPlayerId: string | null | undefined
): ClientGameSession {
  const parserKeys = clientSessionKeys.filter((key) => key !== 'players')
  const filteredSession = pickFields(session, parserKeys)

  const sessionCollection = session.collection ?? getFallbackCollection(session.tableSize)

  let currentClientPlayer: ClientPlayer
  let otherClientPlayer: ClientPlayer | null | undefined

  if (session.mode === 'SINGLE') {
    currentClientPlayer = session.owner
      ? parseSchemaToClientPlayer(session.owner)
      : deletedPlayerPlaceholder
  } else {
    const currentPlayer = session.owner?.id === currentPlayerId
      ? session.owner
      : session.guest
    
    const otherPlayer = session.guest?.id === currentPlayerId
      ? session.owner
      : session.guest

    currentClientPlayer = currentPlayer ? parseSchemaToClientPlayer(currentPlayer) : deletedPlayerPlaceholder
    otherClientPlayer = otherPlayer ? parseSchemaToClientPlayer(otherPlayer) : deletedPlayerPlaceholder
  }

  return {
    ...filteredSession,
    collectionId: sessionCollection.id,
    players: {
      current: currentClientPlayer,
      other: otherClientPlayer
    },
    cards: pairSessionCardsWithCollection(session.cards, sessionCollection.cards)
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
 * @param {z.infer<typeof sessionFilterSchema>} filterInput - The filter input that includes optional player and stats filters.
 * 
 * @returns {Prisma.GameSessionWhereInput} - A Prisma query input for filtering game sessions.
 */
export function parseSessionFilter(
  userId: string,
  filterInput: z.infer<typeof sessionFilterSchema>
): Prisma.GameSessionWhereInput {
  const where: Prisma.GameSessionWhereInput = {
    OR: [
      { owner: { userId } },
      { guest: { userId } }
    ]
  }

  const { success, data: filter } = sessionFilterSchema.safeParse(filterInput)
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
