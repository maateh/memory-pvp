// types
import type { GameSession, SessionStatus } from "@repo/db"
import type { ClientSessionVariants } from "@repo/schema/session"

// helpers
import { calculateElo } from "@repo/helper/elo"

// server
import { db } from "@/db"

/**
 * Closes a game session and updates player statistics.
 * 
 * - Updates player profiles with the latest Elo rating, game stats, and session count.
 * - Updates the session status to `FINISHED`, `CLOSED`, or `FORCE_CLOSED`.
 * - Records the session results for each participating player.
 * - Operations are executed within a database transaction.
 * 
 * @param {ClientSession} clientSession The current session containing player data, mode, and stats.
 * @param {string} requesterPlayerId The ID of the player requesting the session closure.
 * @param {SessionStatus} status Session "action" status.
 * @returns {Promise<GameSession>} The updated game session.
 */
export async function closeSession(
  clientSession: Pick<ClientSessionVariants, "slug" | "mode" | "format" | "tableSize" | "owner" | "guest" | "cards" | "stats">,
  requesterPlayerId: string,
  status: Extract<SessionStatus, "FINISHED" | "CLOSED" | "FORCE_CLOSED">
): Promise<GameSession> {
  const { slug, format, owner, guest, cards, stats } = clientSession

  const players = [owner]
  if (format === "PVP" || format === "COOP") players.push(guest!)

  /* Updates the statistics of session players */
  const playerStatsOperations = players.map(
    (player) => db.playerProfile.update({
      where: { id: player.id },
      data: {
        stats: {
          elo: calculateElo(clientSession, player.id, status, requesterPlayerId).newElo,
          flips: player.stats.flips + stats.flips[player.id],
          matches: player.stats.matches + stats.matches[player.id],
          timer: player.stats.timer + stats.timer,
          sessions: ++player.stats.sessions
        }
      }
    })
  )

  const [session] = await Promise.all([
    /* Updates the affected game session based on the given status */
    db.gameSession.update({
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
              gainedElo: calculateElo(clientSession, player.id, status, requesterPlayerId).gainedElo,
              flips: stats.flips[player.id],
              matches: stats.matches[player.id],
              timer: stats.timer
            }))
          }
        }
      }
    }),
    db.$transaction(playerStatsOperations)
  ])

  return session
}
