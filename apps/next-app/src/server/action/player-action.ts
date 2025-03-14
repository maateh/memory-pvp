"use server"

import { revalidatePath } from "next/cache"

// server
import { ServerError } from "@repo/server/error"
import { playerActionClient, protectedActionClient } from "@/server/action"

// helpers
import { parseSchemaToClientPlayer } from "@/lib/util/parser/player-parser"

// validations
import { playerTag } from "@repo/schema/player"
import {
  createPlayerValidation,
  updatePlayerValidation
} from "@repo/schema/player-validation"

export const createPlayer = protectedActionClient
  .schema(createPlayerValidation)
  .action(async ({ ctx, parsedInput }) => {
    const { tag, color } = parsedInput

    const playerAmount = await ctx.db.playerProfile.count({
      where: {
        userId: ctx.user.id
      }
    })

    if (playerAmount > 5) {
      ServerError.throwInAction({
        key: "PLAYER_PROFILE_LIMIT",
        message: "Player profile limitation.",
        description: "Sorry, but you have reached the maximum number (5) of players you can create."
      })
    }

    const tagAlreadyTaken = await ctx.db.playerProfile.findUnique({ where: { tag } })
    if (tagAlreadyTaken) {
      ServerError.throwInAction({
        key: "ALREADY_TAKEN",
        message: "Player tag is already in use.",
        description: "Sorry, but this player tag is already taken. Please try another one."
      })
    }

    const activePlayerAmount = await ctx.db.playerProfile.count({
      where: {
        userId: ctx.user.id,
        isActive: true
      }
    })

    const player = await ctx.db.playerProfile.create({
      data: {
        userId: ctx.user.id,
        isActive: activePlayerAmount === 0,
        tag,
        color
      }
    })

    revalidatePath("/dashboard/players")
    return parseSchemaToClientPlayer(player)
  })

export const selectPlayerAsActive = playerActionClient
  .schema(playerTag)
  .action(async ({ ctx, parsedInput: tag }) => {
    await ctx.db.playerProfile.updateMany({
      where: {
        userId: ctx.user.id,
        isActive: true
      },
      data: {
        isActive: false
      }
    })

    const player = await ctx.db.playerProfile.update({
      where: {
        userId: ctx.user.id,
        tag
      },
      data: {
        isActive: true
      }
    })

    revalidatePath('/')
    return parseSchemaToClientPlayer(player)
  })

export const updatePlayer = playerActionClient
  .schema(updatePlayerValidation)
  .action(async ({ ctx, parsedInput }) => {
    const { previousTag, tag, color } = parsedInput

    const tagAlreadyTaken = await ctx.db.playerProfile.findUnique({
      where: {
        tag: tag,
        AND: {
          tag: {
            not: previousTag
          }
        }
      }
    })

    if (tagAlreadyTaken) {
      ServerError.throwInAction({
        key: "ALREADY_TAKEN",
        message: "Player tag is already in use.",
        description: "Sorry, but this player tag is already taken. Please try another one."
      })
    }

    const player = await ctx.db.playerProfile.update({
      where: {
        userId: ctx.user.id,
        tag: previousTag
      },
      data: { tag, color }
    })

    revalidatePath("/dashboard/players")
    return parseSchemaToClientPlayer(player)
  })

export const deletePlayer = playerActionClient
  .schema(playerTag)
  .action(async ({ ctx, parsedInput: tag }) => {
    const playerIsActive = await ctx.db.playerProfile.findUnique({
      where: {
        tag,
        isActive: true
      }
    })

    if (playerIsActive) {
      ServerError.throwInAction({
        key: "ACTIVE_PLAYER_PROFILE",
        message: "Player profile cannot be deleted.",
        description: `${playerIsActive.tag} is an active player profile. Please select another player profile before deleting this one.`
      })
    }

    const player = await ctx.db.playerProfile.delete({
      where: {
        userId: ctx.user.id,
        tag,
        isActive: {
          not: true
        }
      }
    })
    
    revalidatePath("/dashboard/players")
    return parseSchemaToClientPlayer(player)
  })
