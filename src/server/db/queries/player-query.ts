// types
import type { z } from "zod"
import type { playerFilterSchema, playerSortSchema } from "@/lib/validations/player-schema"

// prisma
import type { Prisma } from "@prisma/client"

// server
import { db } from "@/server/db"
import { signedIn } from "@/server/actions/user-action"

// helpers
import { parseSchemaToClientPlayer } from "@/lib/utils/parser/player-parser"

/**
 * Retrieves the first found player profile associated with the signed-in user.
 * 
 * - Fetches the signed-in user using the `signedIn` function.
 * - If no user is signed in, returns `null`.
 * - Looks for a player profile that matches the provided `id`, `tag`, or `isActive` fields for the authenticated user.
 * - Optionally includes the user's avatar image if the `withAvatar` flag is set to `true`.
 * 
 * @param {Object} filter - The filter criteria to find the player profile. Can be filtered by `id`, `tag`, or `isActive`.
 * @param {boolean} [withAvatar=false] - Optional flag to include the player's avatar image.
 * 
 * @returns {Promise<ClientPlayer | null>} - The player's profile with the associated avatar (optional), or `null` if no match is found.
 */
export async function getPlayer({ filter, withAvatar = false }: Partial<{
  filter: z.infer<typeof playerFilterSchema>
  withAvatar: boolean
}>): Promise<ClientPlayer | null> {
  const user = await signedIn()
  if (!user) return null

  /* Optionally includes user avatar */
  let include: Prisma.PlayerProfileInclude | null = null
  if (withAvatar) {
    include = {
      user: {
        select: { imageUrl: true }
      }
    }
  }

  const activePlayer = await db.playerProfile.findFirst({
    where: {
      userId: user.id,
      ...filter
    },
    include
  })

  let clientPlayer: ClientPlayer | null = null
  if (activePlayer) {
    clientPlayer = parseSchemaToClientPlayer(activePlayer)
  }

  return clientPlayer
}

/**
 * Retrieves player profiles associated with the signed-in user.
 * 
 * - Fetches the signed-in user using the `signedIn` function.
 * - If no user is signed in, returns an empty array.
 * - Retrieves all player profiles belonging to the authenticated user from the database.
 * - Optionally includes the user's avatar image if the `withAvatar` flag is set to `true`.
 * 
 * @returns {Promise<ClientPlayer[]>} - A list of player profiles associated with the user.
 */
export async function getPlayers({ filter, sort, withAvatar = false }: Partial<{
  filter: z.infer<typeof playerFilterSchema>
  sort: z.infer<typeof playerSortSchema>
  withAvatar: boolean
}> = {}): Promise<ClientPlayer[]> {
  const user = await signedIn()
  if (!user) return []

  /* Optionally includes user avatar */
  let include: Prisma.PlayerProfileInclude | null = null
  if (withAvatar) {
    include = {
      user: {
        select: { imageUrl: true }
      }
    }
  }

  const players = await db.playerProfile.findMany({
    where: {
      userId: user.id,
      tag: { contains: filter?.tag }
    },
    orderBy: sort,
    include
  })

  return players.map((player) => parseSchemaToClientPlayer(player))
}
