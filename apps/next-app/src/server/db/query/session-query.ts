// types
import type { ClientGameSession } from "@repo/schema/session"
import type { GameSessionWithPlayersWithAvatarWithCollectionWithCards } from "@/lib/types/prisma"
import type { Pagination, PaginationParams } from "@/lib/types/query"
import type { SessionFilterQuery, SessionSortQuery } from "@/lib/schema/query/session-query"

// schema
import { sessionSortQuery } from "@/lib/schema/query/session-query"

// server
import { db } from "@/server/db"
import { signedIn } from "@/server/action/user-action"

// config
import { sessionSchemaFields } from "@/config/session-settings"

// utils
import { parseSortToOrderBy } from "@/lib/util/parser"
import { paginate, paginationWrapper } from "@/lib/util/parser/pagination-parser"
import { parseSchemaToClientSession, parseSessionFilter } from "@/lib/util/parser/session-parser"

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
export async function getClientSessions({ filter, sort, pagination }: {
  filter: SessionFilterQuery
  sort: SessionSortQuery
  pagination: PaginationParams
}): Promise<Pagination<ClientGameSession>> {
  const user = await signedIn()
  if (!user) return paginationWrapper([], 0, pagination)

  const where = parseSessionFilter(user.id, filter)

  const total = await db.gameSession.count({ where })
  const sessions = await db.gameSession.findMany({
    ...paginate(pagination),
    where,
    orderBy: parseSortToOrderBy(sort, sessionSortQuery, { closedAt: "desc" }),
    include: sessionSchemaFields
  })

  const clientSessions = sessions.map((session) => {
    const playerId = session.owner?.userId === user.id
      ? session.owner.id
      : session.guest?.id
    return parseSchemaToClientSession(session, playerId)
  })
  return paginationWrapper(clientSessions, total, pagination)
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
    where: {
      id,
      slug,
      OR: [
        { owner: { userId: user.id } },
        { guest: { userId: user.id } }
      ]
    },
    include: sessionSchemaFields
  })

  if (!session) return null

  const playerId = session.owner?.userId === user.id
    ? session.owner.id
    : session.guest?.id
  return parseSchemaToClientSession(session, playerId)
}

/**
 * TODO: write doc
 * 
 * @param playerId 
 * @returns 
 */
export async function getActiveSession(
  playerId?: string
): Promise<GameSessionWithPlayersWithAvatarWithCollectionWithCards | null> {
  if (!playerId) {
    const user = await signedIn()
    if (!user) return null
    
    const activePlayer = await db.playerProfile.findFirst({ where: { userId: user.id } })
    if (!activePlayer) return null
    playerId = activePlayer.id
  }

  return await db.gameSession.findFirst({
    where: {
      status: "RUNNING",
      OR: [
        { ownerId: playerId },
        { guestId: playerId }
      ]
    },
    include: sessionSchemaFields
  })
}

/**
 * TODO: write doc
 * 
 * @param playerId 
 * @returns 
 */
export async function getActiveClientSession(
  playerId?: string
): Promise<ClientGameSession | null> {
  const activeSession = await getActiveSession(playerId)

  if (!activeSession) return null
  return parseSchemaToClientSession(activeSession, playerId)
}
