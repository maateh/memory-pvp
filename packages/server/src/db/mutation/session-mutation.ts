// types
import type { GameSession, SessionStatus } from "@repo/db"
import type { ClientSession } from "@repo/schema/session"

// helpers
import { calculateElo } from "@repo/helper/elo"

// server
import { db } from "@/db"

/**
 * TODO: write doc
 * 
 * @param clientSession 
 * @param requesterPlayerId 
 * @param status 
 * @returns 
 */
export async function closeSession(
  clientSession: Pick<ClientSession, "slug" | "mode" | "format" | "tableSize" | "owner" | "guest" | "stats">,
  requesterPlayerId: string,
  status: Extract<SessionStatus, "FINISHED" | "CLOSED" | "FORCE_CLOSED">
): Promise<GameSession> {
  const { slug, format, owner, guest, stats } = clientSession

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
          avgTime: 0, // TODO: calculate `avgTime`
          totalTime: player.stats.totalTime + stats.timer,
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
        stats,
        status,
        closedAt: new Date(),
        results: {
          createMany: {
            data: players.map((player) => ({
              playerId: player.id,
              gainedElo: calculateElo(clientSession, player.id, status, requesterPlayerId).gainedElo,
              flips: stats.flips[player.id],
              matches: stats.matches[player.id]
            }))
          }
        }
      }
    }),
    db.$transaction(playerStatsOperations)
  ])

  return session
}
