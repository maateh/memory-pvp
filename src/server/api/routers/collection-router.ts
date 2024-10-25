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
import { parseSchemaToClientCollection } from "@/lib/helpers/collection"

// validations
import { createCollectionSchema } from "@/lib/validations/collection-schema"

export const collectionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createCollectionSchema)
    .mutation(async ({ ctx, input }) => {
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
    })
})
