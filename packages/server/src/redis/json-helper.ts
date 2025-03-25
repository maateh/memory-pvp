// types
import type { UpstashResponse } from "@upstash/redis"

// redis
import { redis } from "@/redis"

// config
import { REDIS_STORE_TTL } from "@/redis/settings"

/**
 * Constructs a JSON path string by appending path segments to a base path.
 * 
 * This function helps in building structured JSON paths dynamically by joining 
 * additional arguments (`args`) to a base path (`basePath`). Each segment is 
 * separated by a dot (`.`), following standard JSON path notation.
 * 
 * @param {string} basePath The initial base path (defaults to `"$"`).
 * @param {string[]} args Additional path segments to append.
 * @returns {string} The constructed JSON path string.
 */
export function jsonPathBuilder(basePath: string = "$", ...args: string[]): string {
  return `${basePath}.${args.join(".")}`
}

type SaveRedisJsonOpts = {
  type?: "create" | "update"
  execution?: "multi" | "pipeline"
  ttl?: number
  override?: Parameters<typeof redis.json.set>["3"]
}

/**
 * Saves JSON data to Redis, supporting both creation and partial updates.
 * 
 * This function provides a flexible way to store JSON objects in Redis using Upstash.
 * It allows for full object creation or selective field updates while supporting 
 * transaction-based execution with optional expiration settings.
 * 
 * @template {Record<string, any>} T The type of the JSON object to store.
 * @param {string} key The Redis key under which the JSON data is stored.
 * @param {string} basePath The base JSON path where the data should be set.
 * @param {T} data The JSON object to store or update.
 * @param {SaveRedisJsonOpts} opts Optional settings:
 *  - `type`: Determines if the operation is a `"create"` (full overwrite) or `"update"` (partial update).
 *  - `execution`: Chooses the transaction mode (`"multi"` or `"pipeline"`).
 *  - `ttl`: Time-to-live (TTL) in seconds for the key.
 *  - `override`: JSON set options to override default behavior.
 * @returns {Promise<UpstashResponse<"OK">>} A promise resolving to an Upstash response indicating success (`"OK"`) or an error.
 */
export async function saveRedisJson<T extends Record<string, any>>(
  key: string,
  basePath: string,
  data: T,
  opts?: SaveRedisJsonOpts
): Promise<UpstashResponse<"OK">> {
  const {
    type = "create",
    execution = "multi",
    ttl = REDIS_STORE_TTL,
    override
  } = opts || {}

  const tx = redis[execution]()
  if (type === "create") {
    tx.json.set(key, basePath, data)
  }

  if (type === "update") {
    Object.keys(data).forEach((fieldKey) => {
      const path = jsonPathBuilder(basePath, fieldKey)
      const fieldValue = data[fieldKey]
  
      tx.json.set(
        key,
        path,
        typeof fieldValue === "string" ? `"${fieldValue}"` : fieldValue,
        override
      )
    })
  }

  tx.expire(key, ttl)
  
  const results = await tx.exec({ keepErrors: true })
  const error = results.find((result) => result.error)?.error

  if (error) return { error }
  return { result: "OK" }
}
