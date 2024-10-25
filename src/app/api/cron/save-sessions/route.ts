// redis
import { redis } from "@/lib/redis"

// db
import { db } from "@/server/db"

const ROUTE_PREFIX = '[API | GET - /cron/save-sessions]'

export async function GET(req: Request) {
  const apiKey = req.headers.get('cron-secret')

  if (apiKey !== process.env.CRON_SECRET) {
    return Response.json({ message: 'Invalid secret.' }, { status: 401 })
  }

  console.info(ROUTE_PREFIX, 'Saving stored sessions...')

  try {
    const sessions = await getSessionsFromRedis()

    const operations = sessions.map(({ players: _, collection: __, ...session }) =>
      db.gameSession.update({
        where: { slug: session.slug },
        data: {
          ...session,
          updatedAt: new Date()
        }
      })
    )

    await db.$transaction(operations)

    const message = `Saved ${sessions.length} sessions from redis.`
    console.info(ROUTE_PREFIX, message)

    return Response.json({ message, saved_sessions: sessions.length }, { status: 200, statusText: message })
  } catch (err) {
    console.error(ROUTE_PREFIX, err)
    return Response.json({ message: 'Failed to save stored sessions.' }, { status: 500 })
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
 * @returns {Promise<ClientGameSession[]>} - A promise that resolves to an array of client game sessions.
 */
async function getSessionsFromRedis(): Promise<ClientGameSession[]> {
  let cursor = 0
  const sessions: ClientGameSession[] = []

  do {
    const [newCursor, sessionKeys] = await redis.scan(cursor, {
      match: 'session:*',
      count: 100
    })


    if (sessionKeys.length > 0) {
      const data = await redis.mget<ClientGameSession[]>(sessionKeys)
      sessions.push(...data)
    }

    cursor = parseInt(newCursor)
  } while (cursor !== 0)

  return sessions
}
