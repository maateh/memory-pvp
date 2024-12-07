// prisma
import type { PlayerProfile, Prisma } from "@prisma/client"

// server
import { db } from "@/server/db"

// helpers
import { calculateSessionScore } from "@/lib/helpers/session"

/**
 * Calculates and updates the player's cumulative stats based on their performance in a game session.
 * 
 * - Uses the `calculateSessionScore` function to determine the player's score
 *   for the session, based on session type, mode, and player performance.
 * - Aggregates the player's total score, timer, flips, matches,
 *   and the number of sessions they participated in.
 * 
 * @param {PlayerProfile} player - The player's profile containing their current stats.
 * @param {Object} session - The game session containing type, mode, table size, and session stats.
 * @param {'finish' | 'abandon'} action - The action indicating whether the session was finished or abandoned (default: 'finish').
 * 
 * @returns {PrismaJson.PlayerStats} - The updated player stats including cumulative score, time, flips, matches, and session count.
 */
export function calculatePlayerStats(
  player: PlayerProfile,
  session: Pick<ClientGameSession, 'type' | 'mode' | 'tableSize' | 'stats'>,
  action: 'finish' | 'abandon' = 'finish'
): PrismaJson.PlayerStats {
  const score = calculateSessionScore(session, player.id, action) || 0

  const sessionStats = session.stats
  const prevStats = player.stats

  return {
    score: prevStats.score + score,
    timer: prevStats.timer + sessionStats.timer,
    flips: prevStats.flips + sessionStats.flips[player.id],
    matches: prevStats.matches + sessionStats.matches[player.id],
    sessions: ++prevStats.sessions
  }
}

/**
 * Generates an array of update operations for bulk updating player stats in a game session.
 * 
 * - For each player, this function calculates their updated stats using `calculatePlayerStats`.
 * - It then creates a Prisma update operation for each player's profile, applying the new stats.
 * - These operations can be used for bulk updates in a transaction or batch operation.
 * 
 * @param {PlayerProfile[]} players - The list of player profiles to update.
 * @param {Object} session - The game session containing type, mode, table size, and session stats.
 * @param {'finish' | 'abandon'} action - The action indicating whether the session was finished or abandoned (default: 'finish').
 * 
 * @returns {Prisma.Prisma__PlayerProfileClient<PlayerProfile>[]} - An array of Prisma update operations for each player's stats.
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
