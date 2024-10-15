"use server"

// prisma
import type { GameSession } from "@prisma/client"

// server
import { db } from "@/server/db"
import { signedIn } from "@/server/actions/signed-in"

// helpers
import { parseSchemaToClientSession } from "@/lib/helpers/session"

/**
 * Retrieves a game session based on a unique filter (either `id`, `slug`, or both) and returns it in a client-friendly format.
 * 
 * - Authenticates the user using the `signedIn` function. If no user is signed in, returns `null`.
 * - Looks for a game session that matches the provided filter, including session details, owner, and player information.
 * - Ensures the authenticated user has access to the session by checking if they are one of the players.
 * - Transforms the session data into a client-friendly format using `parseSchemaToClientSession`.
 * 
 * @param {Object} filter - Filter to find the game session by `id`, `slug`, or both.
 * @returns {Promise<ClientGameSession | null>} - The client-friendly game session or `null` if not found or unauthorized.
 */
export async function getClientSession(
  filter: Pick<GameSession, 'id'> | Pick<GameSession, 'slug'> | Pick<GameSession, 'id' | 'slug'>
): Promise<ClientGameSession | null> {
  const user = await signedIn()
  if (!user) return null

  const session = await db.gameSession.findUnique({
    where: filter,
    include: {
      owner: {
        include: {
          user: {
            select: { imageUrl: true }
          }
        }
      },
      players: {
        include: {
          user: {
            select: { imageUrl: true }
          }
        }
      }
    }
  })

  if (!session) return null

  const hasAccess = session.players.some((player) => player.userId === user.id)
  if (!hasAccess) return null

  const player = session.players.find((player) => player.userId === user.id)

  const clientSession = parseSchemaToClientSession(session, player!.tag)
  return clientSession
}
