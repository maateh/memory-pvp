"use server"

// prisma
import type { PlayerProfile } from "@prisma/client"

// server
import { db } from "@/server/db"
import { signedIn } from "@/server/actions/signed-in"

/**
 * Retrieves the player's profiles associated with the signed-in user.
 * 
 * - Fetches the user information using the `signedIn` function.
 * - If no user is signed in, returns an empty array.
 * - Retrieves all player profiles belonging to the authenticated user from the database.
 * 
 * @returns {Promise<PlayerProfile[]>} - A list of player profiles associated with the user.
 */
export async function getPlayers(): Promise<PlayerProfile[]> {
  const user = await signedIn()
  if (!user) return []

  const players = await db.playerProfile.findMany({
    where: {
      userId: user.id
    }
  })

  return players
}

/**
 * Retrieves player profiles along with the associated user avatar.
 * 
 * - Fetches the signed-in user using the `signedIn` function.
 * - If no user is signed in, returns an empty array.
 * - Fetches the player's profiles along with the user's avatar image from the database.
 * 
 * @returns {Promise<PlayerProfileWithUserAvatar[]>} - A list of player profiles with associated avatars.
 */
export async function getPlayersWithAvatar(): Promise<PlayerProfileWithUserAvatar[]> {
  const user = await signedIn()
  if (!user) return []

  const players = await db.playerProfile.findMany({
    where: {
      userId: user.id
    },
    include: {
      user: {
        select: { imageUrl: true }
      }
    }
  })

  return players
}

/**
 * Retrieves a specific player profile by ID, tag, or active status along with the user's avatar.
 * 
 * - Fetches the signed-in user using the `signedIn` function.
 * - If no user is signed in, returns `null`.
 * - Looks for a player profile that matches the provided `id`, `tag`, or `isActive` fields for the authenticated user.
 * 
 * @param {Object} filter - The filter criteria to find the player profile. Can be filtered by `id`, `tag`, or `isActive`.
 * @returns {Promise<PlayerProfileWithUserAvatar | null>} - The player's profile with the associated avatar, or `null` if no match is found.
 */
export async function getPlayerWithAvatar(
  filter: Pick<Partial<PlayerProfile>, 'id' | 'tag' | 'isActive'>
): Promise<PlayerProfileWithUserAvatar | null> {
  const user = await signedIn()
  if (!user) return null

  const activePlayer = await db.playerProfile.findFirst({
    where: {
      userId: user.id,
      ...filter
    },
    include: {
      user: {
        select: { imageUrl: true }
      }
    }
  })

  return activePlayer
}
