import { createSafeActionClient, DEFAULT_SERVER_ERROR_MESSAGE } from "next-safe-action"

// clerk
import { auth } from "@clerk/nextjs/server"

// server
import { db } from "@/server/db"
import { ActionError } from "@/server/actions/_error"

// helpers
import { getSessionSchemaIncludeFields } from "@/lib/helpers/session"

/**
 * TODO: write doc
 */
export const actionClient = createSafeActionClient({
  handleServerError(err) {
    if (err instanceof ActionError) {
      return err
    }

    return new ActionError({
      key: 'UNKNOWN',
      message: DEFAULT_SERVER_ERROR_MESSAGE
    })
  }
}).use(async ({ next }) => next({ ctx: { db } }))

/**
 * TODO: write doc
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
 * TODO: write doc
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
 * TODO: write doc
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
