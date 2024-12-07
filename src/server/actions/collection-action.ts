"use server"

import { revalidatePath } from "next/cache"

// actions
import { ActionError } from "@/server/actions/_error"
import { protectedActionClient } from "@/server/actions"

// uploadthing
import { utapi } from "@/server/uploadthing"

// helpers
import { parseSchemaToClientCollection } from "@/lib/utils/parser/collection-parser"

// validations
import {
  createCollectionSchema,
  deleteCollectionSchema,
  updateCollectionSchema
} from "@/lib/schema/validation/collection-validation"

export const createCollection = protectedActionClient
  .schema(createCollectionSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { name, description, tableSize, utImages } = parsedInput

    try {
      const collection = await ctx.db.cardCollection.create({
        data: {
          name,
          description,
          tableSize,
          cards: {
            createMany: {
              data: utImages
            }
          },
          user: {
            connect: {
              id: ctx.user.id
            }
          }
        },
        include: {
          cards: true,
          user: true
        }
      })

      revalidatePath('/collections/manage')
      return parseSchemaToClientCollection(collection)
    } catch (_err) {
      const fileKeys = utImages.map(({ utKey }) => utKey)
      await utapi.deleteFiles(fileKeys)

      ActionError.throw({
        key: 'UNKNOWN',
        message: "Failed to create card collection.",
        description: "Something unexpected happened and we cannot create the card collection. Please try again later."
      })
    }
  })

export const updateCollection = protectedActionClient
  .schema(updateCollectionSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { id, name, description } = parsedInput

    const collection = await ctx.db.cardCollection.findFirst({
      where: {
        id,
        userId: ctx.user.id
      }
    })

    if (!collection) {
      ActionError.throw({
        key: 'COLLECTION_ACCESS_DENIED',
        message: 'Collection cannot be updated.',
        description: "No collection found or cannot be accessed with the specified ID."
      })
    }

    const updatedCollection = await ctx.db.cardCollection.update({
      where: {
        id,
        userId: ctx.user.id
      },
      include: {
        user: true,
        cards: true
      },
      data: { name, description }
    })

    revalidatePath('/collections/manage')
    return parseSchemaToClientCollection(updatedCollection)
  })

export const deleteCollection = protectedActionClient
  .schema(deleteCollectionSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { id } = parsedInput

    const collection = await ctx.db.cardCollection.findFirst({
      where: {
        id,
        userId: ctx.user.id
      },
      include: {
        cards: true
      }
    })

    if (!collection) {
      ActionError.throw({
        key: 'COLLECTION_ACCESS_DENIED',
        message: 'Collection cannot be deleted.',
        description: "No collection found or cannot be accessed with the specified ID."
      })
    }

    try {
      const fileKeys = collection.cards.map(({ utKey }) => utKey)
      await utapi.deleteFiles(fileKeys)
    } catch (_err) {
      ActionError.throw({
        key: 'UNKNOWN',
        message: "Failed to delete card collection.",
        description: "Something unexpected happened and we cannot delete your card collection. Please try again later."
      })
    }

    // FIXME: relation between `CardCollection` and `GameSession`
    const deletedCollection = await ctx.db.cardCollection.delete({
      where: {
        id,
        userId: ctx.user.id
      },
      include: {
        user: true,
        cards: true
      }
    })

    revalidatePath('/collections/manage')
    return parseSchemaToClientCollection(deletedCollection)
  })
