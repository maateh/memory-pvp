// types
import type { ClientResult } from "@repo/schema/result"

// server
import { db } from "@repo/server/db"

// config
import { resultSchemaFields } from "@repo/config/result"

// utils
import { parseSchemaToClientResult } from "@/lib/util/parser/result-parser"

/**
 * TODO: write doc
 * 
 * @param slug 
 * @returns 
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
