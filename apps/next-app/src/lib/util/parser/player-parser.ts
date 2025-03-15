// types
import type { Prisma } from "@repo/db"
import type { ClientPlayer, PlayerFilter } from "@repo/schema/player"
import type { PlayerProfileWithUserAvatar } from "@repo/db/types"

// schemas
import { playerFilter } from "@repo/schema/player"

// utils
import { pickFields } from "@/lib/util/parser"

/* Schema parser keys */
export const clientPlayerKeys: (keyof ClientPlayer)[] = [
  'id', 'tag', 'isActive', 'color', 'imageUrl', 'stats',
  'createdAt', 'updatedAt'
] as const

/**
 * Parses the player schema into a client-safe `ClientPlayer` object, removing
 * unnecessary fields and ensuring the player's avatar image is included.
 * 
 * - Combines player data with avatar data, assigning the
 *   `imageUrl` from the associated user if available.
 * - Filters player object to only include the necessary
 *   fields, as defined by `clientPlayerKeys`.
 * 
 * @param {PlayerProfileWithUserAvatar} playerSchema - The player schema that includes user and avatar data.
 * 
 * @returns {ClientPlayer} - A filtered player object ready for client usage, containing only the necessary fields.
 */
export function parseSchemaToClientPlayer(
  playerSchema: PlayerProfileWithUserAvatar
): ClientPlayer {
  const playerWithAvatar: ClientPlayer = {
    ...playerSchema,
    imageUrl: playerSchema.user?.imageUrl || null
  }

  const filteredPlayer = pickFields(playerWithAvatar, clientPlayerKeys)
  return filteredPlayer
}

/**
 * TODO: write doc
 * 
 * @param filter 
 * @param userId 
 * @returns 
 */
export function parsePlayerFilterToWhere(
  filter: PlayerFilter,
  userId: string
): Prisma.PlayerProfileWhereInput {
  const { success, data: parsedFilter } = playerFilter.safeParse(filter)
  if (!success) return { userId }

  return { ...parsedFilter, userId }
}
