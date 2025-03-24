// types
import type { ClientSessionVariants } from "@repo/schema/session"

// redis
import { redis } from "@repo/server/redis"
import { soloSessionKey } from "@repo/server/redis-keys"

// db
import { db } from "@repo/server/db"

const ROUTE_PREFIX = "[API | GET - /cron/save-sessions]"

// TODO: This cron route should be reworked.
// - saving solo client sessions from redis to mongodb (like now)
// - force closing rooms and multiplayer sessions

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization")

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ message: "Invalid secret." }, { status: 401 })
  }

  console.info(ROUTE_PREFIX, "Saving stored sessions...")

  try {
    const sessions = await getSessionsFromRedis()

    const operations = sessions.map(({ owner: _, collectionId: __, ...session }) => {
      return db.gameSession.update({
        where: { slug: session.slug },
        data: {
          ...session,
          guest: undefined,
          updatedAt: new Date()
        }
      })
    })

    await db.$transaction(operations)

    const message = `Saved ${sessions.length} sessions from redis.`
    console.info(ROUTE_PREFIX, message)

    return Response.json({ message, saved_sessions: sessions.length }, { status: 200, statusText: message })
  } catch (err) {
    console.error(ROUTE_PREFIX, err)
    return Response.json({ message: "Failed to save stored sessions." }, { status: 500 })
  }
}

/**
 * Retrieves all game sessions from Redis using a cursor-based scan.
 *
 * - Uses `redis.scan` instead of `redis.keys` to efficiently fetch keys in batches without blocking Redis.
 *   This prevents performance issues, especially in large datasets, as `redis.keys` could potentially lock
 *   Redis during its operation.
 *
 * - Scans for keys matching the pattern 'session:*', retrieves corresponding session data, and aggregates
 *   them into a list of `ClientGameSession[]`.
 *
 * @returns {Promise<ClientSessionVariants[]>} - A promise that resolves to an array of client game sessions.
 */
async function getSessionsFromRedis(): Promise<ClientSessionVariants[]> {
  let cursor = 0
  const sessions: ClientSessionVariants[] = []

  do {
    const [newCursor, sessionKeys] = await redis.scan(cursor, {
      match: soloSessionKey("*"),
      count: 100
    })

    if (sessionKeys.length > 0) {
      const data = await redis.mget<ClientSessionVariants[]>(sessionKeys)
      sessions.push(...data)
    }

    cursor = parseInt(newCursor)
  } while (cursor !== 0)

  return sessions
}
