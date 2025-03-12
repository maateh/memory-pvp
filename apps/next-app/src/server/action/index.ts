import { createSafeActionClient, DEFAULT_SERVER_ERROR_MESSAGE } from "next-safe-action"

// clerk
import { auth } from "@clerk/nextjs/server"

// server
import { db } from "@repo/server/db"
import { getActiveSession } from "@/server/db/query/session-query"

// redis
import { redis } from "@repo/server/redis"
import { getActiveRoom } from "@repo/server/redis-commands"

// utils
import { ServerError } from "@repo/server/error"

/**
 * Creates a safe action client with error handling and adds a shared context for `db` and `redis`.
 * 
 * - Handles server errors by mapping them to `ActionError` instances.
 * - Injects `db` and `redis` into the context for downstream middleware and actions.
 */
export const actionClient = createSafeActionClient({
  handleServerError(err) {
    if (err.cause instanceof ServerError) {
      return { ...err.cause }
    }

    return {
      name: "ServerError",
      thrownBy: "ACTION",
      key: "UNKNOWN",
      message: DEFAULT_SERVER_ERROR_MESSAGE
    } satisfies ServerError
  }
}).use(async ({ next }) => next({ ctx: { db, redis } }))

/**
 * Extends the `actionClient` to enforce user authentication.
 * 
 * - Verifies the user using the clerk authentication service.
 * - Fetches the associated user record from the database.
 * - Throws an `ActionError` if the user is not authenticated or if no user record is found.
 */
export const protectedActionClient = actionClient.use(async ({ ctx, next }) => {
  const { userId: clerkId } = auth()

  if (!clerkId) {
    ServerError.throwInAction({
      key: "CLERK_UNAUTHORIZED",
      message: "You are not signed in to your account."
    })
  }

  const user = await ctx.db.user.findUnique({ where: { clerkId } })

  if (!user) {
    ServerError.throwInAction({
      key: "USER_NOT_FOUND",
      message: "No user data found in the database.",
      description: "Please try to remove your Clerk account and repeat the registration process."
    })
  }

  return next({ ctx: { user } })
})

/**
 * Extends the `protectedActionClient` to find the active player profile.
 * 
 * - Checks if the authenticated user has an active player profile in the database.
 * - Throws an `ActionError` if no active player profile is found.
 */
export const playerActionClient = protectedActionClient.use(async ({ ctx, next }) => {
  const player = await ctx.db.playerProfile.findFirst({
    where: {
      userId: ctx.user.id,
      isActive: true
    }
  })

  if (!player) {
    ServerError.throwInAction({
      key: "PLAYER_PROFILE_NOT_FOUND",
      message: "Active player profile not found."
    })
  }

  return next({ ctx: { player } })
})

/**
 * Extends the `playerActionClient` to find active session room.
 * 
 * - Checks if the active player is currently in a running game session.
 * - Verifies access to the game session for the authenticated user.
 * - Throws an `ActionError` if no active session is found or access is denied.
 */
export const roomActionClient = playerActionClient.use(async ({ ctx, next }) => {
  const activeRoom = await getActiveRoom(ctx.player.id)

  if (!activeRoom) {
    ServerError.throwInAction({
      key: "ROOM_NOT_FOUND",
      message: "Active room not found.",
      description: "You have not joined any session rooms."
    })
  }

  if (activeRoom.status === "waiting" && activeRoom.owner.id !== ctx.player.id) {
    ServerError.throw({
      thrownBy: "SOCKET_API",
      key: "ROOM_ACCESS_DENIED",
      message: "You have no access to this room.",
      description: "Please try creating or joining a new room."
    })
  }

  if (
    activeRoom.status !== "waiting" &&
    activeRoom.owner.id !== ctx.player.id &&
    activeRoom.guest.id !== ctx.player.id
  ) {
    ServerError.throw({
      thrownBy: "SOCKET_API",
      key: "ROOM_ACCESS_DENIED",
      message: "You have no access to this room.",
      description: "Please try creating or joining a new room."
    })
  }

  return next({ ctx: { activeRoom } })
})

/**
 * Extends the `playerActionClient` to find active game session.
 * 
 * - Checks if the active player is currently in a running game session.
 * - Verifies access to the game session for the authenticated user.
 * - Throws an `ActionError` if no active session is found or access is denied.
 */
export const soloSessionActionClient = playerActionClient.use(async ({ ctx, next }) => {
  const activeSession = await getActiveSession("SOLO", ctx.player.id)

  if (!activeSession) {
    ServerError.throwInAction({
      key: "SESSION_NOT_FOUND",
      message: "Solo game session not found.",
      description: "You are currently not participating in any solo game session."
    })
  }

  return next({ ctx: { activeSession } })
})

export const multiplayerSessionActionClient = roomActionClient.use(async ({ ctx, next }) => {
  if (ctx.activeRoom.status !== "running" && ctx.activeRoom.status !== "cancelled") {
    ServerError.throwInAction({
      key: "ROOM_STATUS_CONFLICT",
      message: "Action cannot be executed.",
      description: "You can only do this if the room status is running or cancelled."
    })
  }

  const activeSession = await getActiveSession(["COOP", "PVP"], ctx.player.id)

  if (!activeSession) {
    ServerError.throwInAction({
      key: "SESSION_NOT_FOUND",
      message: "Multiplayer game session not found.",
      description: "You are currently not participating in any multiplayer game session."
    })
  }

  return next({ ctx: { activeRoom: ctx.activeRoom, activeSession } })
})
