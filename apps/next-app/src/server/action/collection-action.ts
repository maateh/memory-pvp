"use server"

import { revalidatePath } from "next/cache"

// server
import { ServerError } from "@repo/server/error"
import { protectedActionClient } from "@/server/action"
import { utapi } from "@/server/uploadthing"

// helpers
import { parseSchemaToClientCollection } from "@/lib/util/parser/collection-parser"

// validations
import {
  createCollectionValidation,
  deleteCollectionSchema,
  updateCollectionValidation
} from "@repo/schema/collection-validation"

export const createCollection = protectedActionClient
  .schema(createCollectionValidation)
  .action(async ({ ctx, parsedInput }) => {
    const { name, description, tableSize, utImages } = parsedInput

    try {
      const collection = await ctx.db.cardCollection.create({
        data: {
          name,
          description,
          tableSize,
          cards: {
            createMany: { data: utImages }
          },
          user: {
            connect: { id: ctx.user.id }
          }
        },
        include: {
          cards: true,
          user: true
        }
      })

      revalidatePath("/collections/manage")
      return parseSchemaToClientCollection(collection)
    } catch (_err) {
      const fileKeys = utImages.map(({ utKey }) => utKey)
      await utapi.deleteFiles(fileKeys)

      ServerError.throwInAction({
        key: "UNKNOWN",
        message: "Failed to create card collection.",
        description: "Something unexpected happened and we cannot create the card collection. Please try again later."
      })
    }
  })

export const updateCollection = protectedActionClient
  .schema(updateCollectionValidation)
  .action(async ({ ctx, parsedInput }) => {
    const { id, name, description } = parsedInput

    const hasAccess = await ctx.db.cardCollection.count({
      where: { id, userId: ctx.user.id }
    })

    if (!hasAccess) {
      ServerError.throwInAction({
        key: "COLLECTION_ACCESS_DENIED",
        message: "Collection cannot be updated.",
        description: "No collection found or cannot be accessed with the specified ID."
      })
    }

    const updatedCollection = await ctx.db.cardCollection.update({
      where: { id, userId: ctx.user.id },
      include: {
        user: true,
        cards: true
      },
      data: { name, description }
    })

    revalidatePath("/collections/manage")
    return parseSchemaToClientCollection(updatedCollection)
  })

export const deleteCollection = protectedActionClient
  .schema(deleteCollectionSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { id } = parsedInput

    const hasAccess = await ctx.db.cardCollection.count({
      where: { id, userId: ctx.user.id }
    })

    if (!hasAccess) {
      ServerError.throwInAction({
        key: "COLLECTION_ACCESS_DENIED",
        message: "Collection cannot be deleted.",
        description: "No collection found or cannot be accessed with the specified ID."
      })
    }

    try {
      const deletedCollection = await ctx.db.cardCollection.delete({
        where: { id, userId: ctx.user.id },
        include: {
          user: true,
          cards: true
        }
      })

      const fileKeys = deletedCollection.cards.map(({ utKey }) => utKey)
      await utapi.deleteFiles(fileKeys)

      revalidatePath('/collections/manage')
      return parseSchemaToClientCollection(deletedCollection)
    } catch (_err) {
      ServerError.throwInAction({
        key: "UNKNOWN",
        message: "Failed to delete card collection.",
        description: "Something unexpected happened and we cannot delete your card collection. Please try again later."
      })
    }
  })
