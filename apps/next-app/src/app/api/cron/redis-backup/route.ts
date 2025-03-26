// types
import type { RoomVariants, RunningRoom } from "@repo/schema/room"
import type { SoloClientSession } from "@repo/schema/session"

// redis
import { redis } from "@repo/server/redis"
import { scanRedisJson } from "@repo/server/redis-json"
import { playerConnectionKey, roomKey, soloSessionKey, waitingRoomsKey } from "@repo/server/redis-keys"

// db
import { db } from "@repo/server/db"
import { playerStatsUpdaterOperations } from "@repo/server/db-player-transaction"
import { closeSessionOperation } from "@repo/server/db-session-transaction"

// helpers
import { reconnectionTimeExpired } from "@repo/helper/connection"

const ROUTE_PREFIX = "[API | GET - /cron/redis-backup]"

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization")

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ message: "Invalid secret." }, { status: 401 })
  }

  console.info(ROUTE_PREFIX, "Execute cron action...")

  try {
    const soloSessions = await scanRedisJson<SoloClientSession>(soloSessionKey("*"))
    const soloOperations = soloSessions.map((session) => {
      const { slug, cards, flipped, stats } = session

      return db.gameSession.update({
        where: { slug },
        data: { cards, flipped, stats }
      })
    })

    const rooms = await scanRedisJson<RoomVariants>(roomKey("*"))
    const expiredRooms = filterExpiredRooms(rooms)
    const cancelledRooms = expiredRooms
      .filter(({ status }) => status === "cancelled") as RunningRoom[]

    const roomOperations = cancelledRooms.flatMap(({ session }) => {
      return [
        ...playerStatsUpdaterOperations(session, "FORCE_CLOSED", { applyPenalty: true }),
        closeSessionOperation(session, "FORCE_CLOSED", { applyPenalty: true })
      ]
    })

    const pipeline = redis.pipeline()
    expiredRooms
      .filter(({ status }) => status === "waiting")
      .forEach(({ slug }) => pipeline.lrem(waitingRoomsKey, 1, slug))

    if (expiredRooms.length > 0) {
      pipeline.del(...keysToDelete(expiredRooms))
    }

    await Promise.all([
      db.$transaction(soloOperations),
      db.$transaction(roomOperations),
      pipeline.length() > 0 ? pipeline.exec() : null
    ])

    const message = `Saved ${soloSessions.length} sessions from redis.`
    console.info(ROUTE_PREFIX, message)

    return Response.json({
      message,
      saved_solo_sessions: soloSessions.length,
      closed_expired_rooms: expiredRooms.length,
      closed_multiplayer_session: cancelledRooms.length
    }, { status: 200, statusText: message })
  } catch (err) {
    console.error(ROUTE_PREFIX, err)
    return Response.json({ message: "Failed to execute cron action." }, { status: 500 })
  }
}

function filterExpiredRooms(rooms: RoomVariants[]): RoomVariants[] {
  return rooms.filter(({ status, owner, guest }) => {
    const ownerTimeExpired = reconnectionTimeExpired(owner.connection)
    const guestTimeExpired = status === "waiting" || reconnectionTimeExpired(guest.connection)
    return ownerTimeExpired && guestTimeExpired
  }) as RunningRoom[]
}

function keysToDelete(expiredRooms: RoomVariants[]): string[] {
  return expiredRooms.flatMap((room) => {
    const { slug, owner, guest } = room

    const keys = [roomKey(slug), playerConnectionKey(owner.id)]
    if (guest) keys.push(playerConnectionKey(guest.id))

    return keys
  })
}
