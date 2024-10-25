// trpc
import {
  createTRPCRouter,
  protectedProcedure
} from "@/server/api/trpc"

// helpers
import { parseSchemaToClientCollection } from "@/lib/helpers/collection"

// validations
import { createCollectionSchema } from "@/lib/validations/collection-schema"

export const collectionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createCollectionSchema)
    .mutation(async ({ ctx, input }) => {
      const { name, description, tableSize, utImages } = input

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
    })
})
