// types
import type { PlayerProfile } from "@prisma/client"

// server
import { db } from "@/server/db"

// helpers
import { calculatePlayerSessionScore } from "@/lib/helper/session-helper"

export async function updateSessionStatus({ session, sessionPlayers, player, action }: {
  session: Pick<ClientGameSession, 'slug' | 'type' | 'mode' | 'tableSize' | 'stats'>
  sessionPlayers?: PlayerProfile[]
  player: PlayerProfile
  action: 'finish' | 'abandon'
}) {
  const players = sessionPlayers || [player]

  /* Updates the statistics of session players */
  const operations = players.map(
    (player) => db.playerProfile.update({
      where: { id: player.id },
      data: {
        stats: {
          score: player.stats.score + (calculatePlayerSessionScore(session, player.id, action) || 0),
          timer: player.stats.timer + session.stats.timer,
          flips: player.stats.flips + session.stats.flips[player.id],
          matches: player.stats.matches + session.stats.matches[player.id],
          sessions: ++player.stats.sessions
        }
      }
    })
  )
  await db.$transaction(operations)

  /* Updates the affected game session based on the given action */
  return await db.gameSession.update({
    where: { slug: session.slug },
    data: {
      ...session,
      status: action === 'finish' ? 'FINISHED' : 'ABANDONED',
      closedAt: new Date(),
      results: {
        createMany: {
          data: players.map((player) => ({
            playerId: player.id,
            flips: session.stats.flips[player.id],
            matches: session.stats.matches[player.id],

            // TODO: IF `session.mode === 'PVP' && action === 'abandon'`
            // -> only deducts points from the player who abandoned the session
            score: calculatePlayerSessionScore(session, player.id, action)
          }))
        }
      }
    }
  })
}
