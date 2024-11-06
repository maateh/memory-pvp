"use server"

// types
import type { z } from "zod"
import type { GameSession } from "@prisma/client"
import type { getSessionsSchema } from "@/lib/validations/session-schema"

// server
import { db } from "@/server/db"
import { signedIn } from "@/server/actions/signed-in"

// helpers
import {
  getSessionSchemaIncludeFields,
  parseSchemaToClientSession,
  parseSessionFilter
} from "@/lib/helpers/session"

// utils
import { parseSortToOrderBy } from "@/lib/utils"

/**
 * Retrieves a list of game sessions for the signed-in user, parsed into `ClientGameSession` instances.
 * 
 * - Fetches game sessions from the database based on the provided filter and sort criteria.
 * - Returns an empty array if no user is signed in.
 * - Filters sessions using the signed-in user’s ID and additional criteria specified in the input.
 * - Orders sessions according to the parsed sort criteria.
 * - Includes session owner, collection, user, and player data as specified by `getSessionSchemaIncludeFields`.
 * - Converts each session to the `ClientGameSession` format.
 * 
 * @param {z.infer<typeof getSessionsSchema>} input - The filter and sort criteria for retrieving sessions.
 * @returns {Promise<ClientGameSession[]>} - An array of parsed sessions, or an empty array if no user is signed in.
 */
export async function getClientSessions(
  input: z.infer<typeof getSessionsSchema>
): Promise<ClientGameSession[]> {
  const user = await signedIn()
  if (!user) return []

  const filter = parseSessionFilter(user.id, input.filter)

  const sessions = await db.gameSession.findMany({
    where: filter,
    orderBy: parseSortToOrderBy(input.sort),
    include: getSessionSchemaIncludeFields()
  })

  const clientSessions = sessions.map((session) => {
    const playerTag = session.owner.tag
    return parseSchemaToClientSession(session, playerTag)
  })

  return clientSessions
}

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
    include: getSessionSchemaIncludeFields()
  })

  if (!session) return null

  const hasAccess = session.players.some((player) => player.userId === user.id)
  if (!hasAccess) return null

  const player = session.players.find((player) => player.userId === user.id)

  const clientSession = parseSchemaToClientSession(session, player!.tag)
  return clientSession
}
