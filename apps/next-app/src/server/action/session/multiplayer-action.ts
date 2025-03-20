"use server"

import { redirect, RedirectType } from "next/navigation"

// types
import type { MultiplayerClientSession } from "@repo/schema/session"
import type { JoinedRoom, RunningRoom, WaitingRoom } from "@repo/schema/room"

// redis
import { redis } from "@repo/server/redis"
import { playerConnectionKey, roomKey, waitingRoomsKey } from "@repo/server/redis-keys"
import {
  closeRoom,
  closeSession,
  getActiveRoom,
  getRoom,
  leaveRoom
} from "@repo/server/redis-commands"

// db
import { getActiveSession } from "@/server/db/query/session-query"

// actions
import {
  multiplayerSessionActionClient,
  playerActionClient,
  roomActionClient
} from "@/server/action"

// config
import { sessionSchemaFields } from "@/config/session-settings"

// validations
import { createMultiplayerSessionValidation } from "@repo/schema/session-validation"
import { createRoomValidation, joinRoomValidation } from "@repo/schema/room-validation"

// helpers
import { currentPlayerKey } from "@repo/helper/player"
import { offlinePlayerConnection } from "@repo/helper/connection"
import {
  generateSessionCards,
  generateSessionSlug,
  verifyCollectionInAction
} from "@/lib/helper/session-helper"

// utils
import { ServerError } from "@repo/server/error"
import { parseSchemaToClientSession } from "@/lib/util/parser/session-parser"

export const createRoom = playerActionClient
  .schema(createRoomValidation)
  .action(async ({ ctx, parsedInput }) => {
    const { settings } = parsedInput

    /* Throws server error with 'ACTIVE_SESSION' key if active session found. */
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

    /**
     * Checks collection exists with the specified `collectionId`.
     * Throws custom server errors if collection is not found
     * or table size is incompatible with the settings.
     */
    await verifyCollectionInAction(settings)

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

    redirect("/game/multiplayer")
  })

export const joinRoom = playerActionClient
  .schema(joinRoomValidation)
  .action(async ({ ctx, parsedInput }) => {
    const { roomSlug } = parsedInput

    /* Checks if there is any ongoing session */
    const activeSession = await getActiveSession(["COOP", "PVP"], ctx.player.id)

    /* Throws server error with 'ACTIVE_SESSION' key if active session found. */
    if (activeSession) {
      ServerError.throwInAction({
        key: "ACTIVE_SESSION",
        data: { activeSessionMode: activeSession.mode },
        message: "Active multiplayer session found.",
        description: "Please finish your session, before you start a new one."
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

export const createMultiplayerSession = playerActionClient
  .schema(createMultiplayerSessionValidation)
  .action(async ({ ctx, parsedInput }) => {
    const { slug, guestId } = parsedInput
    const { collectionId, ...settings } = parsedInput.settings

    const activeSession = await getActiveSession(["COOP", "PVP"], ctx.player.id)
    const guestActiveSession = await getActiveSession(["COOP", "PVP"], guestId)

    if (activeSession || guestActiveSession) {
      ServerError.throwInAction({
        key: "ACTIVE_SESSION",
        message: "Active multiplayer session found.",
        description: "Session cannot be started as long as one of the players is in another multiplayer session."
      })
    }

    /**
     * Checks collection exists with the specified `collectionId`.
     * Throws custom server errors if collection is not found
     * or table size is incompatible with the settings.
     */
    const collection = await verifyCollectionInAction({ ...settings, collectionId })

    /* Create the multiplayer game session */
    const session = await ctx.db.gameSession.create({
      data: {
        ...settings,
        slug,
        status: "RUNNING",
        flipped: [],
        cards: generateSessionCards(collection, settings.tableSize),
        currentTurn: Math.random() < 0.5 ? ctx.player.id : guestId,
        stats: {
          timer: 0,
          flips: {
            [ctx.player.id]: 0,
            [guestId]: 0
          },
          matches: {
            [ctx.player.id]: 0,
            [guestId]: 0
          }
        },
        collection: { connect: { id: collection.id } },
        owner: { connect: { id: ctx.player.id } },
        guest: { connect: { id: guestId } }
      },
      include: sessionSchemaFields
    })

    /* Gets the player's active room. */
    const activeRoom = await getActiveRoom<JoinedRoom>(ctx.player.id)

    /* Throws server error with `ROOM_NOT_FOUND` key if active room not found. */
    if (!activeRoom) {
      ServerError.throwInAction({
        key: "ROOM_NOT_FOUND",
        message: "Active room not found.",
        description: "Something went wrong. Please create or join another room."
      })
    }

    /* Updates the `JoinedRoom` room variant to a `RunningRoom` variant. */
    const room: RunningRoom = {
      ...activeRoom,
      status: "running",
      session: parseSchemaToClientSession(session) as MultiplayerClientSession
    }

    /* Throws server error with `UNKNOWN` key if failed to store the updated room data. */
    const response = await redis.json.set(roomKey(room.slug), "$", room, { xx: true })
    if (response !== "OK") {
      ServerError.throwInAction({
        key: "UNKNOWN",
        message: "Failed to store game session.",
        description: "Cache server probably not available."
      })
    }
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

export const forceCloseMultiplayerSession = multiplayerSessionActionClient
  .action(async ({ ctx }) => {
    await closeSession(ctx.activeRoom, ctx.player.id, "FORCE_CLOSED")

    /**
     * Note: Unfortunately, passing 'RedirectType.replace' as the redirect type doesn't work in NextJS 14.
     * Looks like it has been fixed in NextJS 15 so this will be a bit buggy until then.
     * 
     * https://github.com/vercel/next.js/discussions/60864
     */
    redirect(`/game/summary/${ctx.activeSession.slug}`, RedirectType.replace)
  })
