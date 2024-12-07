// prisma
import type { PlayerProfile, Prisma } from "@prisma/client"

// server
import { db } from "@/server/db"

// constants
import { clientPlayerKeys } from "@/constants/player"

// helpers
import { calculateSessionScore } from "@/lib/helpers/session"

// utils
import { pickFields } from "@/lib/utils/parser"

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
