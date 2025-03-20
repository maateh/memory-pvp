// types
import type { ClientResult } from "@repo/schema/result"

// server
import { db } from "@repo/server/db"

// config
import { resultSchemaFields } from "@repo/config/result"

// utils
import { parseSchemaToClientResult } from "@/lib/util/parser/result-parser"

/**
 * Retrieves and parses game results for a given session.
 * 
 * - Fetches results from the database based on the session `slug`.
 * - Includes related fields as defined in `resultSchemaFields`.
 * - Converts each result into a client-friendly format.
 * 
 * @param {string} slug The unique identifier of the game session.
 * @returns {Promise<ClientResult[]>} A list of parsed client results.
 */
export async function getResults(
  slug: string
): Promise<ClientResult[]> {
  const results = await db.result.findMany({
    where: { session: { slug } },
    include: resultSchemaFields
  })

  return results.map((result) => parseSchemaToClientResult(result))
}
