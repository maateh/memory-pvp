// types
import type { MatchFormat } from "@repo/db"
import type { ClientSessionVariants } from "@repo/schema/session"
import type { GameSessionWithPlayersWithAvatarWithCollectionWithCards } from "@repo/db/types"
import type { Pagination, PaginationParams } from "@repo/schema/search"
import type { SessionFilterQuery, SessionSortQuery } from "@/lib/schema/query/session-query"

// db
import { db } from "@repo/server/db"

// redis
import { redis } from "@repo/server/redis"
import { sessionKey } from "@repo/server/redis-keys"

// actions
import { signedIn } from "@/server/action/user-action"

// schema
import { sessionSortQuery } from "@/lib/schema/query/session-query"

// config
import { sessionSchemaFields } from "@/config/session-settings"

// utils
import { parseSortToOrderBy } from "@/lib/util/parser"
import { paginate, paginationWrapper } from "@/lib/util/parser/pagination-parser"
import { parseSchemaToClientSession, parseSessionFilterToWhere } from "@/lib/util/parser/session-parser"

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
 * @returns {Promise<ClientSessionVariants[]>} - An array of parsed sessions, or an empty array if no user is signed in.
 */
export async function getClientSessions({ filter, sort, pagination }: {
  filter: SessionFilterQuery
  sort: SessionSortQuery
  pagination: PaginationParams
}): Promise<Pagination<ClientSessionVariants>> {
  const user = await signedIn()
  if (!user) return paginationWrapper([], 0, pagination)

  const where = parseSessionFilterToWhere(filter, user.id)

  const total = await db.gameSession.count({ where })
  const sessions = await db.gameSession.findMany({
    ...paginate(pagination),
    where,
    orderBy: parseSortToOrderBy(sort, sessionSortQuery, { closedAt: "desc" }),
    include: sessionSchemaFields
  })

  const clientSessions = sessions.map((session) => parseSchemaToClientSession(session))
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
 * @returns {Promise<ClientSessionVariants | null>} - The client-friendly game session or `null` if not found or unauthorized.
 */
export async function getClientSession({ id, slug }: {
  id: string
  slug?: never
} | {
  slug: string
  id?: never
}): Promise<ClientSessionVariants | null> {
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
  return parseSchemaToClientSession(session)
}

/**
 * Retrieves the active game session for a given player.
 * 
 * - If no `playerId` is provided, it attempts to determine the player based on the signed-in user.
 * - Searches for a game session that is currently in the "RUNNING" state.
 * - Returns the session with all relevant data, including players, avatars, collection, and cards.
 * 
 * @param {MatchFormat | MatchFormat[]} format - The match format of the session.
 * @param {string} playerId - The ID of the player whose active session should be retrieved.
 * @returns {Promise<GameSessionWithPlayersWithAvatarWithCollectionWithCards | null>} - The active game session or `null` if none exists.
 */
export async function getActiveSession(
  format: MatchFormat | MatchFormat[],
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
      format: typeof format === "string" ? format : { in: format },
      OR: [
        { ownerId: playerId },
        { guestId: playerId }
      ]
    },
    include: sessionSchemaFields
  })
}

/**
 * Retrieves the active game session for a given player and converts it to a client-friendly format.
 * 
 * - Calls `getActiveSession` to find the currently running session for the player.
 * - If an active session exists, it is parsed into a `ClientSession` format.
 * - Returns `null` if no active session is found.
 * 
 * @param {MatchFormat | MatchFormat[]} format - The match format of the session.
 * @param {string} playerId - The ID of the player whose active session should be retrieved.
 * @returns {Promise<ClientSessionVariants | null>} - The active game session in a client-friendly format or `null` if none exists.
 */
export async function getActiveClientSession(
  format: MatchFormat | MatchFormat[],
  playerId?: string
): Promise<ClientSessionVariants | null> {
  const activeSession = await getActiveSession(format, playerId)
  if (!activeSession) return null

  /**
   * Note: Yep, that makes no sense. Will be reworked after singleplayer
   * and multiplayer sessions are managed individually.
   * 
   * https://github.com/maateh/memory-pvp/issues/19
   */
  if (format === "SOLO") {
    const storedSession = await redis.get<ClientSessionVariants>(sessionKey(activeSession.slug))
    if (storedSession) return storedSession
  }

  return parseSchemaToClientSession(activeSession)
}
