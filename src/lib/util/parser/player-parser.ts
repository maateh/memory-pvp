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
