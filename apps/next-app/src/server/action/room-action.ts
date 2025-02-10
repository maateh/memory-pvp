"use server"

// types
import type { JoinedRoom, WaitingRoom } from "@repo/schema/session-room"

// actions
import { ApiError } from "@/server/_error"
import { playerActionClient } from "@/server/action"

// config
import { getRoom } from "@repo/server/redis-commands"
import { playerConnectionKey, roomKey, waitingRoomsKey } from "@repo/server/redis-keys"
import { playerConnection } from "@repo/server/redis-data-parser"

// schemas
import { createSessionRoomValidation, joinSessionRoomValidation } from "@repo/schema/session-room-validation"

// utils
import { generateSessionSlug } from "@/lib/helper/session-helper"

export const createRoom = playerActionClient
  .schema(createSessionRoomValidation)
  .action(async ({ ctx, parsedInput }) => {
    // TODO: remove owner from validation
    const { owner: _, ...settings } = parsedInput

    const room: WaitingRoom = {
      status: "waiting",
      slug: generateSessionSlug(settings),
      owner: {
        ...ctx.player,
        status: "offline",
        socketId: null,
        ready: false
      },
      settings,
      createdAt: new Date()
    }

    await Promise.all([
      ctx.redis.hset(playerConnectionKey(ctx.player.id), playerConnection({
        playerId: ctx.player.id,
        roomSlug: room.slug,
        status: "offline"
      })),
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
    const joinedRoom: JoinedRoom = {
      ...room,
      status: "joined",
      guest: {
        ...ctx.player,
        status: "offline",
        socketId: null,
        ready: false
      }
    }

    await Promise.all([
      ctx.redis.hset(playerConnectionKey(ctx.player.id), playerConnection({
        playerId: ctx.player.id,
        roomSlug: room.slug,
        status: "offline"
      })),
      ctx.redis.json.set(roomKey(roomSlug), "$", joinedRoom, { xx: true }),
      ctx.redis.lrem(waitingRoomsKey, 1, roomSlug)
    ])

    // TODO: add custom `outputSchema`
    // https://github.com/maateh/memory-pvp/issues/15
    return { roomSlug: room.slug }
  })
