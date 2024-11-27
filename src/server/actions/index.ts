import { createSafeActionClient, DEFAULT_SERVER_ERROR_MESSAGE } from "next-safe-action"

// clerk
import { auth } from "@clerk/nextjs/server"

// server
import { ActionError } from "@/server/actions/_error"
import { db } from "@/server/db"
import { redis } from "@/lib/redis"

// helpers
import { getSessionSchemaIncludeFields } from "@/lib/helpers/session"

/**
 * Creates a safe action client with error handling and adds a shared context for `db` and `redis`.
 * 
 * - Handles server errors by mapping them to `ActionError` instances.
 * - Injects `db` and `redis` into the context for downstream middleware and actions.
 */
export const actionClient = createSafeActionClient({
  handleServerError(err) {
    if (err.cause instanceof ActionError) {
      return { ...err.cause }
    }

    return {
      name: 'ActionError',
      key: 'UNKNOWN',
      message: DEFAULT_SERVER_ERROR_MESSAGE
    } satisfies ActionError
  }
}).use(async ({ next }) => next({ ctx: { db, redis } }))

/**
 * Extends the action client to enforce user authentication.
 * 
 * - Verifies the user using the clerk authentication service.
 * - Fetches the associated user record from the database.
 * - Throws an `ActionError` if the user is not authenticated or if no user record is found.
 */
export const protectedActionClient = actionClient.use(async ({ ctx, next }) => {
  const { userId: clerkId } = auth()

  if (!clerkId) {
    throw new ActionError({
      key: 'CLERK_UNAUTHORIZED',
      message: 'You are not signed in to your account.'
    })
  }

  const user = await ctx.db.user.findUnique({ where: { clerkId } })

  if (!user) {
    throw new ActionError({
      key: 'USER_NOT_FOUND',
      message: "No user data found in the database.",
      description: "Please try to remove your Clerk account and repeat the registration process."
    })
  }

  return next({ ctx: { user } })
})

/**
 * Extends the protected action client to validate the active player profile.
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
    throw new ActionError({
      key: 'PLAYER_PROFILE_NOT_FOUND',
      message: 'Active player profile not found.'
    })
  }

  return next({ ctx: { player } })
})

/**
 * Extends the player action client to enforce active game session validation.
 * 
 * - Checks if the active player is currently in a running game session.
 * - Verifies access to the game session for the authenticated user.
 * - Throws an `ActionError` if no active session is found or access is denied.
 */
export const sessionActionClient = playerActionClient.use(async ({ ctx, next }) => {
  const activeSession = await ctx.db.gameSession.findFirst({
    where: {
      status: 'RUNNING',
      players: {
        some: {
          id: ctx.player.id
        }
      }
    },
    include: getSessionSchemaIncludeFields()
  })

  if (!activeSession) {
    throw new ActionError({
      key: 'SESSION_NOT_FOUND',
      message: 'Game session not found.',
      description: "You are currently not participating in any game session."
    })
  }

  const hasAccess = activeSession.players.some((player) => player.userId === ctx.user.id)
  if (!hasAccess) {
    throw new ActionError({
      key: 'SESSION_ACCESS_DENIED',
      message: "Game session access denied.",
      description: "You don't have access to this game session."
    })
  }

  return next({ ctx: { activeSession } })
})
