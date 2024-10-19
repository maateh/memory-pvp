import { nanoid } from "nanoid"

// types
import type { z } from "zod"
import type { Prisma } from "@prisma/client"

// helpers
import { parseSchemaToClientPlayer } from "@/lib/helpers/player"

// utils
import { pickFields } from "@/lib/utils"

// constants
import { clientSessionKeys } from "@/constants/session"
import { sessionFilterSchema } from "@/lib/validations/session-schema"

/**
 * Generates a unique slug for a game session based on its type and mode.
 * 
 * - The slug starts with a prefix formed by taking the first two characters of the session's `type` 
 *   and the first three characters of the session's `mode`, both in lowercase.
 * - A unique 8-character identifier is appended to the prefix, generated by `nanoid` and replacing any 
 *   underscores (`_`) with hyphens (`-`).
 * 
 * This slug can be used as a unique identifier for the session.
 * 
 * @param {Object} session - The game session containing type and mode.
 * 
 * @returns {string} - The generated slug in the format `xx-yyy_xxxxxxxx`.
 */
export function generateSlug(
  session: Pick<ClientGameSession, 'type' | 'mode'>,
  isOffline: boolean = false
): string {
  const { type, mode } = session

  /**
   * Creates a prefix by slicing then merging the first
   * characters of session 'type' and 'mode'.
   */
  let prefix = `${type.slice(0, 2).toLowerCase()}-${mode.slice(0, 3).toLowerCase()}`

  if (isOffline) {
    prefix = 'off'
  }

  /** Prevents generating `_` symbol by nanoid. */
  const id = nanoid(8).replace(/_/g, '-')

  return `${prefix}_${id}`
}

/**
 * Parses a `GameSessionWithOwnerWithPlayersWithAvatar` schema into a `ClientGameSession`, 
 * organizing player data based on the current player's tag.
 * 
 * - The `players` field is structured to have:
 *   - `current`: The player object whose tag matches the `currentPlayerTag`.
 *   - `other`: The other player in the session.
 * 
 * @param {GameSessionPlayersWithAvatar} session - The full session data including players and avatars.
 * @param {string} currentPlayerTag - The tag of the current player to identify them in the session.
 * @returns {ClientGameSession} - A parsed session with player data structured into `current` and `other` fields.
 */
export function parseSchemaToClientSession(
  session: GameSessionPlayersWithAvatar,
  currentPlayerTag: string
): ClientGameSession {
  const filteredSession = pickFields(session, clientSessionKeys)

  const players = {
    current: filteredSession.players.find((player) => player.tag === currentPlayerTag)!,
    other: filteredSession.players.find((player) => player.tag !== currentPlayerTag)
  }

  return {
    ...filteredSession,
    players: {
      current: parseSchemaToClientPlayer(players.current),
      other: players.other ? parseSchemaToClientPlayer(players.other) : null
    }
  }
}

/**
 * Parses the provided session filter input to create a `Prisma.GameSessionWhereInput` object, 
 * which can be used to query game sessions using Prisma.
 * 
 * - Filters sessions by the owner's user ID and optionally by players and stats.
 * - If `players` are provided in the input, it checks whether any of the players in the session 
 *   have a matching tag from the input.
 * - Filters session stats if provided in the input.
 * 
 * @param {string} userId - The ID of the session owner to filter by.
 * @param {Object} filterInput - The filter input that includes optional player and stats filters.
 * 
 * @returns {Prisma.GameSessionWhereInput} - A Prisma query input for filtering game sessions.
 */
export function parseSessionFilter(
  userId: string,
  filterInput: z.infer<typeof sessionFilterSchema>
): Prisma.GameSessionWhereInput {
  const { playerTag, stats, ...filter } = filterInput

  return {
    owner: { userId },
    players: {
      some: {
        tag: {
          equals: playerTag
        }
      }
    },
    stats: stats as Prisma.JsonFilter<"GameSession"> | undefined,
    ...filter
  }
}
