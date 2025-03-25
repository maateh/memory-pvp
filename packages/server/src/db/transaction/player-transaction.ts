// types
import type { PlayerProfile, Prisma } from "@repo/db"
import type { closeSession } from "@/db/mutation/session-mutation"

// helpers
import { calculateElo } from "@repo/helper/elo"

// server
import { db } from "@/db"

/**
 * TODO: write doc
 * 
 * @param session 
 * @param requesterPlayerId 
 * @param status 
 * @returns 
 */
export function playerStatsUpdaterOperations(
  session: Parameters<typeof closeSession>["0"],
  status: Parameters<typeof closeSession>["1"],
  requesterPlayerId: Parameters<typeof closeSession>["2"]
): Prisma.Prisma__PlayerProfileClient<PlayerProfile>[] {
  const { format, owner, guest, stats } = session

  const players = [owner]
  if (format === "PVP" || format === "COOP") players.push(guest!)

  return players.map(
    (player) => db.playerProfile.update({
      where: { id: player.id },
      data: {
        stats: {
          elo: calculateElo(session, player.id, status, requesterPlayerId).newElo,
          flips: player.stats.flips + stats.flips[player.id],
          matches: player.stats.matches + stats.matches[player.id],
          timer: player.stats.timer + stats.timer,
          sessions: ++player.stats.sessions
        }
      }
    })
  )
}
