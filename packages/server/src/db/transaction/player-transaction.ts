// types
import type { PlayerProfile, Prisma } from "@repo/db"
import type { closeSession } from "@/db/mutation/session-mutation"

// helpers
import { calculateElo } from "@repo/helper/elo"

// server
import { db } from "@/db"

/**
 * Generates database update operations to update player statistics after a session ends.
 * 
 * This function prepares Prisma update operations to adjust player statistics, including Elo rating, 
 * flips, matches, total playtime, and session count, based on the game session results.
 * 
 * @param {ClientSessionVariants} session The current session containing player data, mode, and stats.
 * @param {SessionStatus} status Session "action" status.
 * @param {string} requesterPlayerId The ID of the player requesting the session closure.
 * @returns An array of Prisma update operations for player statistics.
 */
export function playerStatsUpdaterOperations(
  session: Parameters<typeof closeSession>["0"],
  status: Parameters<typeof closeSession>["1"],
  requesterPlayerId?: Parameters<typeof closeSession>["2"]
): Prisma.Prisma__PlayerProfileClient<PlayerProfile>[] {
  const { format, owner, guest, stats } = session

  const players = [owner]
  if (format === "PVP" || format === "COOP") players.push(guest!)

  return players.map(
    (player) => db.playerProfile.update({
      where: { id: player.id },
      data: {
        stats: {
          elo: calculateElo(session, player.id, status, requesterPlayerId || player.id).newElo,
          flips: player.stats.flips + stats.flips[player.id],
          matches: player.stats.matches + stats.matches[player.id],
          timer: player.stats.timer + stats.timer,
          sessions: ++player.stats.sessions
        }
      }
    })
  )
}
