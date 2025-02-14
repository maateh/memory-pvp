"use server"

// types
import type { JoinedRoom, WaitingRoom } from "@repo/schema/room"
import type { PlayerConnection } from "@repo/schema/player-connection"

// redis
import { getRoom } from "@repo/server/redis-commands"
import { playerConnectionKey, roomKey, waitingRoomsKey } from "@repo/server/redis-keys"

// server
import { ServerError } from "@repo/server/error"
import { playerActionClient } from "@/server/action"

// schemas
import { createSessionRoomValidation, joinSessionRoomValidation } from "@repo/schema/room-validation"

// utils
import { generateSessionSlug } from "@/lib/helper/session-helper"

export const createRoom = playerActionClient
  .schema(createSessionRoomValidation)
  .action(async ({ ctx, parsedInput }) => {
    // TODO: remove owner from validation
    const { owner: _, ...settings } = parsedInput

    const slug = generateSessionSlug(settings)

    const connection: PlayerConnection = {
      playerId: ctx.player.id,
      playerTag: ctx.player.tag,
      roomSlug: slug,
      status: "offline",
      createdAt: new Date(),
      socketId: null,
      connectedAt: null
    }

    const room: WaitingRoom = {
      slug,
      status: "waiting",
      owner: {
        ...ctx.player,
        ready: false,
        connection
      },
      settings,
      createdAt: new Date()
    }

    await Promise.all([
      ctx.redis.hset(playerConnectionKey(ctx.player.id), connection),
      ctx.redis.json.set(roomKey(room.slug), `$`, room),
      ctx.redis.lpush(waitingRoomsKey, room.slug)
    ])

    // TODO: add custom `outputSchema`
    // https://github.com/maateh/memory-pvp/issues/15
    return { roomSlug: room.slug }
  })

export const joinRoom = playerActionClient
  .schema(joinSessionRoomValidation)
  .action(async ({ ctx, parsedInput }) => {
    // TODO: remove guest from validation
    const { guest:_, roomSlug } = parsedInput

    const room = await getRoom<WaitingRoom>(roomSlug)

    const connection: PlayerConnection = {
      playerId: ctx.player.id,
      playerTag: ctx.player.tag,
      roomSlug: room.slug,
      status: "offline",
      createdAt: new Date(),
      socketId: null,
      connectedAt: null
    }

    const joinedRoom: JoinedRoom = {
      ...room,
      status: "joined",
      guest: {
        ...ctx.player,
        ready: false,
        connection
      }
    }

    await Promise.all([
      ctx.redis.hset(playerConnectionKey(ctx.player.id), connection),
      ctx.redis.json.set(roomKey(roomSlug), "$", joinedRoom, { xx: true }),
      ctx.redis.lrem(waitingRoomsKey, 1, roomSlug)
    ])

    // TODO: add custom `outputSchema`
    // https://github.com/maateh/memory-pvp/issues/15
    return { roomSlug: room.slug }
  })
