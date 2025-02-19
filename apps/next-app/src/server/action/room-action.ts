"use server"

import { redirect, RedirectType } from "next/navigation"

// types
import type { JoinedRoom, WaitingRoom } from "@repo/schema/room"

// redis
import { getRoom } from "@repo/server/redis-commands"
import { playerConnectionKey, roomKey, waitingRoomsKey } from "@repo/server/redis-keys"

// db
import { getActiveSession } from "@/server/db/query/session-query"
import { updateSessionStatus } from "@/server/db/mutation/session-mutation"

// actions
import { playerActionClient } from "@/server/action"

// schemas
import { createSessionRoomValidation, joinSessionRoomValidation } from "@repo/schema/room-validation"

// helpers
import { generateSessionSlug } from "@/lib/helper/session-helper"

// utils
import { ServerError } from "@repo/server/error"
import { offlinePlayer } from "@repo/server/util"

export const createRoom = playerActionClient
  .schema(createSessionRoomValidation)
  .action(async ({ ctx, parsedInput }) => {
    const { settings, forceStart } = parsedInput

    /* Checks if there is any ongoing session */
    const activeSession = await getActiveSession(ctx.player.id)

    /* Throws server error with 'ACTIVE_SESSION' key if active session found. */
    if (activeSession && !forceStart) {
      ServerError.throwInAction({
        key: "ACTIVE_SESSION",
        data: { activeSessionMode: activeSession.mode },
        message: "Active game session found.",
        description: activeSession.mode === "SINGLE"
          ? "Would you like to continue the ongoing session or start a new one?"
          : "Please finish your active multiplayer session, before you start a new one."
      })
    }

    /* Abandons active session if 'forceStart' is applied. */
    if (activeSession && forceStart) {
      /* Note: multiplayer sessions can only be closed manually by the player. */
      if (activeSession.mode !== "SINGLE") {
        ServerError.throwInAction({
          key: "FORCE_START_NOT_ALLOWED",
          message: "Force start not allowed.",
          description: "You are not allowed to force close multiplayer sessions. Please finish it first, before you start a new one."
        })
      }

      await updateSessionStatus({
        session: activeSession,
        player: ctx.player,
        action: "abandon"
      })
    }

    // FIXME: if player has active room -> throw error with `ACTIVE_ROOM` key

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
      connectionStatus: "offline",
      owner: {
        ...ctx.player,
        role: "owner",
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

    /**
     * Note: Unfortunately, passing 'RedirectType.replace' as the redirect type doesn't work in NextJS 14.
     * Looks like it has been fixed in NextJS 15 so this will be a bit buggy until then.
     * 
     * https://github.com/vercel/next.js/discussions/60864
     */
    redirect(`/game/room/${room.slug}`, RedirectType.replace)
  })

export const joinRoom = playerActionClient
  .schema(joinSessionRoomValidation)
  .action(async ({ ctx, parsedInput }) => {
    const { roomSlug } = parsedInput

    // FIXME: if player has active session -> throw error with `ACTIVE_SESSION` key
    // FIXME: if player has active room -> throw error with `ACTIVE_ROOM` key

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
        role: "guest",
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
