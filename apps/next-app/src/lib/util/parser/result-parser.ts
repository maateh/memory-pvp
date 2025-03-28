// types
import type { Prisma } from "@repo/db"
import type { ClientResult } from "@repo/schema/result"
import type { ResultFilter } from "@repo/schema/session"
import type { ResultWithPlayerWithSession } from "@repo/db/types"

// schemas
import { resultFilter } from "@repo/schema/session"

// utils
import { parseSchemaToClientPlayer } from "@/lib/util/parser/player-parser"
import { pickFields } from "@/lib/util/parser"

/* Schema parser keys */
export const clientResultKeys: (keyof ClientResult)[] = [
  'id', 'player', 'session',
  'gainedElo', 'flips', 'matches', 'timer',
  'createdAt', 'updatedAt'
] as const


/**
 * Parses a database result schema into a client-friendly result format.
 * 
 * - Removes unnecessary fields from the result object.
 * - Converts the `player` field into a client-compatible format.
 * 
 * @param {ResultWithPlayerWithSession} result The raw result object including player and session data.
 * @returns {ClientResult} The parsed result with only relevant fields for the client.
 */
export function parseSchemaToClientResult(
  result: ResultWithPlayerWithSession
): ClientResult {
  const { player, ...filteredResult } = pickFields(result, clientResultKeys)

  return {
    ...filteredResult,
    player: parseSchemaToClientPlayer(player)
  }
}

/**
 * TODO: write doc
 * 
 * @param filter 
 * @param userId 
 * @returns 
 */
export function parseResultFilterToWhere(
  filter: ResultFilter,
  playerId: string,
  userId: string
): Prisma.ResultWhereInput {
  let where: Prisma.ResultWhereInput = { player: { id: playerId, userId } }
  const { success, data: parsedFilter } = resultFilter.safeParse(filter)

  if (!success) return where
  return { ...where, session: parsedFilter }
}
