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
 * TODO: write doc
 * 
 * @param result 
 * @returns 
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
