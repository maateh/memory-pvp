// types
import type { GameSession } from "@repo/db"
import type { BaseClientSession } from "@repo/schema/session"

// server
import { db } from "@repo/server/db"

// helpers
import { calculatePlayerSessionScore } from "@/lib/helper/session-helper"

/**
 * Updates the status of a game session and updates player statistics accordingly.
 * 
 * - Updates player statistics such as score, timer, flips, matches, and session count.
 * - Updates the game session status to either "FINISHED" or "ABANDONED".
 * - Stores the session results for each player.
 * 
 * @param {BaseClientSession} clientSession - The session data to update.
 * @param {string} currentPlayerId - The player id of the player who requested this action.
 * @param {"finish" | "abandon"} action - The action to perform on the session (finishing or abandoning).
 * @returns {Promise<GameSession>} - The updated game session.
 */
export async function updateSessionStatus(
  clientSession: Pick<BaseClientSession, "slug" | "type" | "mode" | "tableSize" | "owner" | "guest" | "stats">,
  currentPlayerId: string,
  action: "finish" | "abandon"
): Promise<GameSession> {
  const { slug, mode, owner, guest, stats } = clientSession

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
