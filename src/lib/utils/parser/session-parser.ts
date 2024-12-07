// types
import type { z } from "zod"
import type { Prisma } from "@prisma/client"
import type { sessionFilterSchema } from "@/lib/validations/session-schema"

// helpers
import { pairSessionCardsWithCollection } from "@/lib/helpers/session-helper"

// utils
import { parseSchemaToClientPlayer } from "@/lib/utils/parser/player-parser"
import { pickFields } from "@/lib/utils/parser"

/* Schema parser keys */
export const clientSessionKeys: (keyof ClientGameSession)[] = [
  'slug', 'collectionId',
  'type', 'mode', 'tableSize', 'status',
  'players', 'stats',
  'flipped', 'cards',
  'startedAt', 'continuedAt', 'closedAt', 'updatedAt'
] as const

export const offlineSessionKeys: (keyof UnsignedClientGameSession)[] = [
  'collectionId',
  'tableSize',
  'players', 'stats',
  'flipped', 'cards',
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
  currentPlayerId: string
): ClientGameSession {
  const filteredSession = pickFields(session, clientSessionKeys)

  const players = {
    current: filteredSession.players.find((player) => player.id === currentPlayerId)!,
    other: filteredSession.players.find((player) => player.id !== currentPlayerId)
  }

  return {
    ...filteredSession,
    cards: pairSessionCardsWithCollection(session.cards, session.collection.cards),
    players: {
      current: parseSchemaToClientPlayer(players.current),
      other: players.other ? parseSchemaToClientPlayer(players.other) : null
    }
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
 * @param {Object} filterInput - The filter input that includes optional player and stats filters.
 * 
 * @returns {Prisma.GameSessionWhereInput} - A Prisma query input for filtering game sessions.
 */
export function parseSessionFilter(
  userId: string,
  filterInput: z.infer<typeof sessionFilterSchema>
): Prisma.GameSessionWhereInput {
  const { playerId, ...filter } = filterInput

  return {
    owner: { userId },
    players: {
      some: {
        id: { equals: playerId }
      }
    },
    ...filter
  }
}