"use server"

// types
import type { JoinedRoom, WaitingRoom } from "@repo/schema/room"

// redis
import { getRoom } from "@repo/server/redis-commands"
import { playerConnectionKey, roomKey, waitingRoomsKey } from "@repo/server/redis-keys"

// server
import { playerActionClient } from "@/server/action"

// schemas
import { createSessionRoomValidation, joinSessionRoomValidation } from "@repo/schema/room-validation"

// utils
import { offlinePlayer } from "@repo/server/util"
import { generateSessionSlug } from "@/lib/helper/session-helper"

export const createRoom = playerActionClient
  .schema(createSessionRoomValidation)
  .action(async ({ ctx, parsedInput }) => {
    const { settings } = parsedInput

    const slug = generateSessionSlug(settings)
    const connection = offlinePlayer({
      playerId: ctx.player.id,
      playerTag: ctx.player.tag,
      roomSlug: slug,
      createdAt: new Date(),
    })

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
    const { roomSlug } = parsedInput

    const room = await getRoom<WaitingRoom>(roomSlug)
    const connection = offlinePlayer({
      playerId: ctx.player.id,
      playerTag: ctx.player.tag,
      roomSlug: room.slug,
      createdAt: new Date(),
    })

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
