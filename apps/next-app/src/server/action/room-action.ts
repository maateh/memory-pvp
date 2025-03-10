"use server"

import { redirect, RedirectType } from "next/navigation"

// types
import type { JoinedRoom, WaitingRoom } from "@repo/schema/room"

// redis
import { closeRoom, getActiveRoom, getRoom, leaveRoom } from "@repo/server/redis-commands"
import { playerConnectionKey, roomKey, waitingRoomsKey } from "@repo/server/redis-keys"

// db
import { updateSessionStatus } from "@repo/server/db-session-mutation"
import { getActiveSession } from "@/server/db/query/session-query"

// actions
import { playerActionClient, roomActionClient } from "@/server/action"

// schemas
import { createRoomValidation, joinRoomValidation } from "@repo/schema/room-validation"

// helpers
import { offlinePlayerConnection } from "@repo/helper/connection"
import { currentPlayerKey } from "@repo/helper/player"
import { generateSessionSlug } from "@/lib/helper/session-helper"

// utils
import { ServerError } from "@repo/server/error"
import { parseSchemaToClientSession } from "@/lib/util/parser/session-parser"

export const createRoom = playerActionClient
  .schema(createRoomValidation)
  .action(async ({ ctx, parsedInput }) => {
    const { settings, forceStart } = parsedInput

    if (settings.type === "COMPETITIVE") {
      ServerError.throwInAction({
        key: "UNKNOWN",
        message: "Ranked mode is not available.",
        description: "Currently, you can only play in Casual because the ranked system is under development."
      })
    }

    /* Throws server error with 'ACTIVE_SESSION' key if active (multiplayer) session found. */
    const activeSession = await getActiveSession(["COOP", "PVP"], ctx.player.id)
    if (activeSession) {
      ServerError.throwInAction({
        key: "ACTIVE_SESSION",
        message: "Active game session found.",
        description: "Please finish your multiplayer session, before you start a new one."
      })
    }

    /* Throws server error with 'ACTIVE_ROOM' key if active room found. */
    const activeRoom = await getActiveRoom(ctx.player.id)
    if (activeRoom) {
      ServerError.throwInAction({
        key: "ACTIVE_ROOM",
        message: "Active room found.",
        description: "You have already joined another room. Please leave it first."
      })
    }

    const slug = generateSessionSlug(settings)
    const connection = offlinePlayerConnection({
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
    redirect("/game/multiplayer", forceStart ? RedirectType.replace : RedirectType.push)
  })

export const joinRoom = playerActionClient
  .schema(joinRoomValidation)
  .action(async ({ ctx, parsedInput }) => {
    const { roomSlug, forceJoin } = parsedInput

    /* Checks if there is any ongoing session */
    const activeSession = await getActiveSession(["COOP", "PVP"], ctx.player.id)

    /* Throws server error with 'ACTIVE_SESSION' key if active session found. */
    if (activeSession && !forceJoin) {
      ServerError.throwInAction({
        key: "ACTIVE_SESSION",
        data: { activeSessionMode: activeSession.mode },
        message: "Active game session found.",
        description: activeSession.mode === "SINGLE"
          ? "Would you like to force close your ongoing session and join the room?"
          : "Please finish your active multiplayer session, before you start a new one."
      })
    }

    /* Abandons active session if 'forceJoin' is applied. */
    if (activeSession && forceJoin) {
      /* Note: multiplayer sessions can only be closed manually by the player. */
      if (activeSession.mode !== "SINGLE") {
        ServerError.throwInAction({
          key: "FORCE_START_NOT_ALLOWED",
          message: "Force start not allowed.",
          description: "You are not allowed to force close multiplayer sessions. Please finish it first, before you start a new one."
        })
      }

      await updateSessionStatus(
        parseSchemaToClientSession(activeSession),
        ctx.player.id,
        "abandon"
      )
    }

    /* Throws server error with 'ACTIVE_ROOM' key if active room found. */
    const activeRoom = await getActiveRoom(ctx.player.id)
    if (activeRoom) {
      ServerError.throwInAction({
        key: "ACTIVE_ROOM",
        message: "Active room found.",
        description: "You have already joined another room. Please leave it first."
      })
    }

    /**
     * Gets the room the player wants to join.
     * Throws server error with 'ROOM_NOT_FOUND' key if the room not found.
     */
    const room = await getRoom<WaitingRoom>(roomSlug)
    if (!room) {
      ServerError.throwInAction({
        key: "ROOM_NOT_FOUND",
        message: "Room not found.",
        description: "Sorry, but this room is probably already closed."
      })
    }

    const connection = offlinePlayerConnection({
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

    redirect("/game/multiplayer")
  })

export const leaveOrCloseRoom = roomActionClient
  .action(async ({ ctx }) => {
    const playerKey = currentPlayerKey(ctx.activeRoom.owner.id, ctx.player.id)

    if (ctx.activeRoom.status !== "waiting" && ctx.activeRoom.status !== "joined") {
      ServerError.throwInAction({
        key: "ROOM_STATUS_CONFLICT",
        message: `Failed to ${playerKey === "owner" ? "close" : "leave"} the room.`,
        description: `"You can only ${playerKey === "owner" ? "close" : "leave"} the room if the status is waiting."`
      })
    }

    const leaveOrCloseCommand = playerKey === "owner"
      ? closeRoom
      : leaveRoom

    await leaveOrCloseCommand(ctx.activeRoom, ctx.player.id)
    redirect("/game/setup")
  })
