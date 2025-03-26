// types
import type { GameSession, SessionStatus } from "@repo/db"
import type { ClientSessionVariants } from "@repo/schema/session"

// db
import { db } from "@/db"
import { playerStatsUpdaterOperations } from "@/db/transaction/player-transaction"
import { closeSessionOperation } from "@/db/transaction/session-transaction"

/**
 * Closes a game session and updates player statistics.
 * 
 * - Updates player profiles with the latest Elo rating, game stats, and session count.
 * - Updates the session status to `FINISHED`, `CLOSED`, or `FORCE_CLOSED`.
 * - Records the session results for each participating player.
 * - Operations are executed within a database transaction.
 * 
 * @param {ClientSessionVariants} session The current session containing player data, mode, and stats.
 * @param {SessionStatus} status Session "action" status.
 * @param {string} requesterPlayerId The ID of the player requesting the session closure.
 * @returns {Promise<GameSession>} The updated game session.
 */
export async function closeSession(
  session: Pick<ClientSessionVariants, "slug" | "mode" | "format" | "tableSize" | "owner" | "guest" | "cards" | "stats">,
  status: Extract<SessionStatus, "FINISHED" | "CLOSED" | "FORCE_CLOSED">,
  requesterPlayerId?: string
): Promise<GameSession> {
  const [closedSession] = await Promise.all([
    closeSessionOperation(session, status, requesterPlayerId),
    db.$transaction(playerStatsUpdaterOperations(session, status, requesterPlayerId))
  ])

  return closedSession
}
