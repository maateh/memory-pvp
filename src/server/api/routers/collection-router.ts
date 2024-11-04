// trpc
import { TRPCError } from "@trpc/server"
import { TRPCApiError } from "@/trpc/error"
import {
  createTRPCRouter,
  protectedProcedure
} from "@/server/api/trpc"

// uploadthing
import { utapi } from "@/server/uploadthing"

// helpers
import {
  parseSchemaToClientCollection
} from "@/lib/helpers/collection"

// validations
import {
  createCollectionSchema,
  deleteCollectionSchema,
  updateCollectionSchema
} from "@/lib/validations/collection-schema"

export const collectionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createCollectionSchema)
    .mutation(async ({ ctx, input }): Promise<ClientCardCollection> => {
      const { name, description, tableSize, utImages } = input

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

        return parseSchemaToClientCollection(collection)
      } catch (_err) {
        const fileKeys = utImages.map(({ utKey }) => utKey)
        await utapi.deleteFiles(fileKeys)

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          cause: new TRPCApiError({
            key: 'UNKNOWN',
            message: "Failed to create card collection.",
            description: "Something unexpected happened and we cannot create your card collection. Please try again later."
          })
        })
      }
    }),

  update: protectedProcedure
    .input(updateCollectionSchema)
    .mutation(async ({ ctx, input }): Promise<ClientCardCollection> => {
      const { id, name, description } = input

      const collectionAmount = await ctx.db.playerProfile.count({
        where: {
          id,
          userId: ctx.user.id
        }
      })

      if (collectionAmount === 0) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          cause: new TRPCApiError({
            key: 'COLLECTION_ACCESS_DENIED',
            message: 'Collection cannot be updated.',
            description: "No collection found or cannot be accessed with the specified ID."
          })
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

      return parseSchemaToClientCollection(updatedCollection)
    }),

  delete: protectedProcedure
    .input(deleteCollectionSchema)
    .mutation(async ({ ctx, input }): Promise<ClientCardCollection> => {
      const { id } = input

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
        throw new TRPCError({
          code: 'FORBIDDEN',
          cause: new TRPCApiError({
            key: 'COLLECTION_ACCESS_DENIED',
            message: 'Collection cannot be deleted.',
            description: "No collection found or cannot be accessed with the specified ID."
          })
        })
      }

      try {
        const fileKeys = collection.cards.map(({ utKey }) => utKey)
        await utapi.deleteFiles(fileKeys)
      } catch (_err) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          cause: new TRPCApiError({
            key: 'UNKNOWN',
            message: "Failed to delete card collection.",
            description: "Something unexpected happened and we cannot delete your card collection. Please try again later."
          })
        })
      }

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

      return parseSchemaToClientCollection(deletedCollection)
    })
})
