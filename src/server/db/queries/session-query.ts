// types
import type { z } from "zod"
import type { sessionFilterSchema, sessionSortSchema } from "@/lib/schema/param/session-param"

// server
import { db } from "@/server/db"
import { signedIn } from "@/server/actions/user-action"

// config
import { sessionSchemaFields } from "@/config/session-settings"

// utils
import { parseSchemaToClientSession, parseSessionFilter } from "@/lib/utils/parser/session-parser"
import { parseSortToOrderBy } from "@/lib/utils/parser"

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
 * @param {Object} input - The filter and sort criteria for retrieving sessions.
 * @returns {Promise<ClientGameSession[]>} - An array of parsed sessions, or an empty array if no user is signed in.
 */
export async function getClientSessions({ filter, sort }: {
  filter: z.infer<typeof sessionFilterSchema>
  sort: z.infer<typeof sessionSortSchema>
  // pagination: z.infer<typeof paginationSchema> TODO: implement
}): Promise<ClientGameSession[]> {
  const user = await signedIn()
  if (!user) return []

  const sessions = await db.gameSession.findMany({
    where: parseSessionFilter(user.id, filter),
    orderBy: parseSortToOrderBy(sort),
    include: sessionSchemaFields
  })

  return sessions.map((session) => parseSchemaToClientSession(session, session.owner.id))
}

/**
 * Retrieves a game session based on a unique filter (either `id`, `slug`, or both) and returns it in a client-friendly format.
 * 
 * - Authenticates the user using the `signedIn` function. If no user is signed in, returns `null`.
 * - Looks for a game session that matches the provided filter, including session details, owner, and player information.
 * - Ensures the authenticated user has access to the session by checking if they are one of the players.
 * - Transforms the session data into a client-friendly format using `parseSchemaToClientSession`.
 * 
 * @param {Object} filter - Filter to find the game session by `id` or `slug`.
 * @returns {Promise<ClientGameSession | null>} - The client-friendly game session or `null` if not found or unauthorized.
 */
export async function getClientSession({ id, slug }: {
  id: string
  slug?: never
} | {
  slug: string
  id?: never
}): Promise<ClientGameSession | null> {
  const user = await signedIn()
  if (!user) return null

  const session = await db.gameSession.findUnique({
    where: { id, slug },
    include: sessionSchemaFields
  })

  if (!session) return null

  const hasAccess = session.players.some((player) => player.userId === user.id)
  if (!hasAccess) return null

  const player = session.players.find((player) => player.userId === user.id)
  return parseSchemaToClientSession(session, player!.id)
}
