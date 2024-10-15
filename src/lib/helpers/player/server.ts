// constants
import { clientPlayerKeys } from "@/constants/player"

// utils
import { pickFields } from "@/lib/utils"

/**
 * TODO: write doc
 * 
 * @param playerSchema 
 * @returns 
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
