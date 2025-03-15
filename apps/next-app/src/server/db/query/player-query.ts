// types
import type { Prisma } from "@repo/db"
import type { ClientPlayer, PlayerFilter, PlayerSort } from "@repo/schema/player"
import type { Search } from "@/lib/types/search"

// schemas
import { playerSort } from "@repo/schema/player"

// db
import { db } from "@repo/server/db"

// actions
import { signedIn } from "@/server/action/user-action"

// utils
import { parseSortToOrderBy } from "@/lib/util/parser/search-parser"
import {
  parsePlayerFilterToWhere,
  parseSchemaToClientPlayer
} from "@/lib/util/parser/player-parser"

/**
 * TODO: rewrite doc
 * 
 * @param filter 
 * @param avatar 
 * @returns 
 */
export async function getPlayer(
  filter: PlayerFilter,
  avatar: "withAvatar" | "withoutAvatar" = "withoutAvatar"
): Promise<ClientPlayer | null> {
  const user = await signedIn()
  if (!user) return null

  /* Optionally includes user avatar */
  let include: Prisma.PlayerProfileInclude | null = null
  if (avatar === "withAvatar") {
    include = {
      user: {
        select: { imageUrl: true }
      }
    }
  }

  const player = await db.playerProfile.findFirst({
    where: parsePlayerFilterToWhere(filter, user.id),
    include
  })

  if (!player) return null
  return parseSchemaToClientPlayer(player)
}

/**
 * TODO: rewrite doc
 * 
 * @param search 
 * @param avatar 
 * @returns 
 */
export async function getPlayers(
  search?: Partial<Omit<Search<PlayerFilter, PlayerSort>, "pagination">>,
  avatar: "withAvatar" | "withoutAvatar" = "withAvatar"
): Promise<ClientPlayer[]> {
  const { filter = {}, sort = {} } = search || {}

  const user = await signedIn()
  if (!user) return []

  /* Optionally includes user avatar */
  let include: Prisma.PlayerProfileInclude | null = null
  if (avatar === "withAvatar") {
    include = {
      user: {
        select: { imageUrl: true }
      }
    }
  }

  const players = await db.playerProfile.findMany({
    where: parsePlayerFilterToWhere(filter, user.id),
    orderBy: parseSortToOrderBy(sort, playerSort),
    include
  })

  return players.map((player) => parseSchemaToClientPlayer(player))
}
