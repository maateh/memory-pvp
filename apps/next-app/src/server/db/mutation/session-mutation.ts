// types
import type { GameSession } from "@repo/db"
import type { BaseClientSession } from "@repo/schema/session"

// server
import { db } from "@/server/db"

// helpers
import { calculatePlayerSessionScore } from "@/lib/helper/session-helper"

/**
 * TODO: write doc
 * 
 * @param clientSession 
 * @param action 
 * @returns 
 */
export async function updateSessionStatus(
  clientSession: Pick<BaseClientSession, "slug" | "type" | "mode" | "tableSize" | "currentPlayerId" | "owner" | "guest" | "stats">,
  action: "finish" | "abandon"
): Promise<GameSession> {
  const { slug, mode, owner, guest, stats, currentPlayerId } = clientSession

  const players = [owner]
  if (mode !== "SINGLE") players.push(guest!)

  /* Updates the statistics of session players */
  const operations = players.map(
    (player) => db.playerProfile.update({
      where: { id: player.id },
      data: {
        stats: {
          score: player.stats.score + (calculatePlayerSessionScore(
            clientSession,
            player.id,
            mode === "PVP" && action === "abandon"
              ? player.id === currentPlayerId ? "abandon" : "finish"
              : action
          ) || 0),
          timer: player.stats.timer + stats.timer,
          flips: player.stats.flips + stats.flips[player.id],
          matches: player.stats.matches + stats.matches[player.id],
          sessions: ++player.stats.sessions
        }
      }
    })
  )
  
  const [session] = await Promise.all([
    /* Updates the affected game session based on the given action */
    db.gameSession.update({
      where: { slug },
      data: {
        status: action === "finish" ? "FINISHED" : "ABANDONED",
        closedAt: new Date(),
        results: {
          createMany: {
            data: players.map((player) => ({
              playerId: player.id,
              flips: stats.flips[player.id],
              matches: stats.matches[player.id],
              score: calculatePlayerSessionScore(
                clientSession,
                player.id,
                mode === "PVP" && action === "abandon"
                  ? player.id === currentPlayerId ? "abandon" : "finish"
                  : action
              )
            }))
          }
        }
      }
    }),
    db.$transaction(operations)
  ])

  return session
}
