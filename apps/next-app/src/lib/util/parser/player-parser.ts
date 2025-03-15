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
 * Parses a player profile schema into a client-friendly player object.
 * 
 * @param {PlayerProfileWithUserAvatar} playerProfile Player profile schema including user avatar.
 * @returns {ClientPlayer} Client-safe player object with selected fields.
 */
export function parseSchemaToClientPlayer(
  playerProfile: PlayerProfileWithUserAvatar
): ClientPlayer {
  const player: ClientPlayer = {
    ...playerProfile,
    imageUrl: playerProfile.user?.imageUrl || null
  }

  return pickFields(player, clientPlayerKeys)
}

/**
 * Parses a player filter into a Prisma where input.
 * 
 * @param {PlayerFilter} filter Player filter object to validate and parse.
 * @param {string} userId ID of the user for filtering.
 * @returns {Prisma.PlayerProfileWhereInput} Prisma where input for querying player profiles.
 */
export function parsePlayerFilterToWhere(
  filter: PlayerFilter,
  userId: string
): Prisma.PlayerProfileWhereInput {
  const { success, data: parsedFilter } = playerFilter.safeParse(filter)
  if (!success) return { userId }

  return { ...parsedFilter, userId }
}
