// prisma
import type { PlayerProfile, Prisma } from "@prisma/client"

// server
import { db } from "@/server/db"

// constants
import { clientPlayerKeys } from "@/constants/player"

// helpers
import { calculateSessionScore } from "@/lib/helpers/session"

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

/**
 * TODO: write doc
 * 
 * @param player 
 * @param session 
 * @param action 
 * @returns 
 */
export function calculatePlayerStats(
  player: PlayerProfile,
  session: Pick<ClientGameSession, 'type' | 'mode' | 'tableSize' | 'stats'>,
  action: 'finish' | 'abandon' = 'finish'
): PrismaJson.PlayerStats {
  const score = calculateSessionScore(session, player.tag, action) || 0

  const sessionStats = session.stats
  const prevStats = player.stats

  return {
    score: prevStats.score + score,
    timer: prevStats.timer + sessionStats.timer,
    flips: prevStats.flips + sessionStats.flips[player.tag],
    matches: prevStats.matches + sessionStats.matches[player.tag],
    sessions: ++prevStats.sessions
  }
}

/**
 * TODO: write doc
 * 
 * @param players 
 * @param sessionStats 
 * @returns 
 */
export function getBulkUpdatePlayerStatsOperations(
  players: PlayerProfile[],
  session: Pick<ClientGameSession, 'type' | 'mode' | 'tableSize' | 'stats'>,
  action: 'finish' | 'abandon' = 'finish'
): Prisma.Prisma__PlayerProfileClient<PlayerProfile>[] {
  const operations = players.map(
    (player) => db.playerProfile.update({
      where: {
        id: player.id
      },
      data: {
        stats: calculatePlayerStats(player, session, action)
      }
    })
  )

  return operations
}
