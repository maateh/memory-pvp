"use server"

// prisma
import type { PlayerProfile } from "@prisma/client"

// server
import { db } from "@/server/db"
import { signedIn } from "@/server/actions/signed-in"

/**
 * TODO: write doc
 * 
 * @returns 
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
 * TODO: write doc
 * 
 * @returns 
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
 * TODO: write doc
 * 
 * @param filter 
 * @returns 
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
