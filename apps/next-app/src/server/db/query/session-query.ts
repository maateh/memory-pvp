// types
import type { MatchFormat } from "@repo/db"
import type { GameSessionWithPlayersWithAvatarWithCollectionWithCards } from "@repo/db/types"
import type { ClientSessionVariants, SessionFilter, SessionSort } from "@repo/schema/session"
import type { Pagination } from "@repo/schema/search"
import type { Search } from "@/lib/types/search"

// schema
import { sessionSort } from "@repo/schema/session"

// db
import { db } from "@repo/server/db"

// redis
import { redis } from "@repo/server/redis"
import { sessionKey } from "@repo/server/redis-keys"

// actions
import { signedIn } from "@/server/action/user-action"

// config
import { sessionSchemaFields } from "@/config/session-settings"

// utils
import { paginate, paginationWrapper } from "@/lib/util/parser/pagination-parser"
import { parseSortToOrderBy } from "@/lib/util/parser/search-parser"
import {
  parseSchemaToClientSession,
  parseSessionFilterToWhere
} from "@/lib/util/parser/session-parser"

/**
 * Retrieves a game session based on its unique `slug` and returns it in a client-friendly format.
 * 
 * - Verifies user authentication using the `signedIn` function. If no user is signed in, returns `null`.
 * - Looks for a game session that matches the provided filter.
 * - Ensures the authenticated user has access to the session by checking if they are one of the players.
 * - Transforms the session data into a client-friendly format using `parseSchemaToClientSession`.
 * 
 * @param {string} slug Unique key to find the game session.
 * @returns {Promise<ClientSessionVariants | null>} The client-friendly game session or `null` if not found or unauthorized.
 */
export async function getClientSession(
  slug: string
): Promise<ClientSessionVariants | null> {
  const user = await signedIn()
  if (!user) return null

  const session = await db.gameSession.findUnique({
    where: {
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
 * TODO: rewrite doc
 * 
 * @param search 
 * @returns 
 */
export async function getClientSessions(
  search: Search<SessionFilter, SessionSort>
): Promise<Pagination<ClientSessionVariants>> {
  const { filter, sort, pagination } = search

  const user = await signedIn()
  if (!user) return paginationWrapper([], 0, pagination)

  const where = parseSessionFilterToWhere(filter, user.id)

  const [total, sessions] = await Promise.all([
    db.gameSession.count({ where }),
    db.gameSession.findMany({
      ...paginate(pagination),
      where,
      orderBy: parseSortToOrderBy(sort, sessionSort, { closedAt: "desc" }),
      include: sessionSchemaFields
    })
  ])

  const clientSessions = sessions.map((session) => parseSchemaToClientSession(session))
  return paginationWrapper(clientSessions, total, pagination)
}

/**
 * Retrieves the active game session for a given player.
 * 
 * - If no `playerId` is provided, it attempts to determine the player based on the signed-in user.
 * - Searches for a game session that is currently in the "RUNNING" state.
 * - Returns the session with all relevant data.
 * 
 * @param {MatchFormat | MatchFormat[]} format The match format of the session.
 * @param {string} playerId The ID of the player whose active session should be retrieved.
 * @returns {Promise<GameSessionWithPlayersWithAvatarWithCollectionWithCards | null>} The active game session or `null` if none exists.
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
 * - If an active session exists, it is parsed into a `ClientSessionVariants` format.
 * - Returns `null` if no active session is found.
 * 
 * @param {MatchFormat | MatchFormat[]} format The match format of the session.
 * @param {string} playerId The ID of the player whose active session should be retrieved.
 * @returns {Promise<ClientSessionVariants | null>} The active game session in a client-friendly format or `null` if none exists.
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
   * TODO: I'm on it.
   * 
   * https://github.com/maateh/memory-pvp/issues/19
   */
  if (format === "SOLO") {
    const storedSession = await redis.get<ClientSessionVariants>(sessionKey(activeSession.slug))
    if (storedSession) return storedSession
  }

  return parseSchemaToClientSession(activeSession)
}
