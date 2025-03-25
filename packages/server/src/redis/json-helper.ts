// types
import type { UpstashResponse } from "@upstash/redis"

// redis
import { redis } from "@/redis"

// config
import { REDIS_STORE_TTL } from "@/redis/settings"

/**
 * TODO: write doc
 * 
 * @param basePath 
 * @param args 
 * @returns 
 */
export function jsonPathBuilder(basePath: string = "$", ...args: string[]): string {
  return `${basePath}.${args.join(".")}`
}

type SaveRedisJsonOpts = {
  type?: "multi" | "pipeline"
  ttl?: number
}

/**
 * TODO: write doc
 * 
 * @param key 
 * @param basePath 
 * @param data 
 * @param opts 
 */
export async function saveRedisJson<T extends Record<string, any>>(
  key: string,
  basePath: string,
  data: T,
  opts?: SaveRedisJsonOpts
): Promise<UpstashResponse<"OK">> {
  const {
    type = "multi",
    ttl = REDIS_STORE_TTL
  } = opts || {}

  const tx = redis[type]()
  Object.keys(data).forEach((fieldKey) => {
    const path = jsonPathBuilder(basePath, fieldKey)
    const fieldValue = data[fieldKey]

    tx.json.set(
      key,
      path,
      typeof fieldValue === "string" ? `"${fieldValue}"` : fieldValue,
      { xx: true }
    )
  })
  tx.expire(key, ttl)
  
  const results = await tx.exec({ keepErrors: true })
  const error = results.find((result) => result.error)?.error

  if (error) return { error }
  return { result: "OK" }
}
