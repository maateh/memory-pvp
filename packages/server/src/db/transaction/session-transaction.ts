// types
import type { GameSession, Prisma } from "@repo/db"
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
export function closeSessionOperation(
  session: Parameters<typeof closeSession>["0"],
  requesterPlayerId: Parameters<typeof closeSession>["1"],
  status: Parameters<typeof closeSession>["2"]
): Prisma.Prisma__GameSessionClient<GameSession> {
  const { slug, format, owner, guest, cards, stats } = session

  const players = [owner]
  if (format === "PVP" || format === "COOP") players.push(guest!)

  return db.gameSession.update({
    where: { slug },
    data: {
      cards,
      stats,
      status,
      closedAt: new Date(),
      results: {
        createMany: {
          data: players.map((player) => ({
            playerId: player.id,
            gainedElo: calculateElo(session, player.id, status, requesterPlayerId).gainedElo,
            flips: stats.flips[player.id],
            matches: stats.matches[player.id],
            timer: stats.timer
          }))
        }
      }
    }
  })
}
