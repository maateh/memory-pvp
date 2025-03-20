// types
import type { ClientResult } from "@repo/schema/result"
import type { ResultWithPlayerWithSession } from "@repo/db/types"

// utils
import { pickFields } from "@/lib/util/parser"
import { parseSchemaToClientPlayer } from "@/lib/util/parser/player-parser"

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
