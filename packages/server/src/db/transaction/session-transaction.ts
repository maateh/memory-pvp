// types
import type { GameSession, Prisma } from "@repo/db"
import type { closeSession } from "@/db/mutation/session-mutation"

// helpers
import { calculateElo } from "@repo/helper/elo"

// server
import { db } from "@/db"

/**
 * Generates a database update operation to finalize a game session.
 * 
 * This function prepares a Prisma update operation to store session results, 
 * update the session's status, save player statistics, and record the session closure time.
 * 
 * @param {ClientSessionVariants} session The current session containing player data, mode, and stats.
 * @param {SessionStatus} status Session "action" status.
 * @param {CloseSessionOpts} options Additional options to manage close session.
 * @returns A Prisma update operation for finalizing the game session.
 */
export function closeSessionOperation(
  session: Parameters<typeof closeSession>["0"],
  status: Parameters<typeof closeSession>["1"],
  options?: Parameters<typeof closeSession>["2"]
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
            gainedElo: calculateElo(session, player.id, {
              ...options,
              requesterPlayerId: options?.requesterPlayerId || player.id
            }).gainedElo,
            flips: stats.flips[player.id],
            matches: stats.matches[player.id],
            timer: stats.timer
          }))
        }
      }
    }
  })
}
