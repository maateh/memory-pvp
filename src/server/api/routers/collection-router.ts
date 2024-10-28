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
  parseCollectionFilter,
  parseSchemaToClientCollection
} from "@/lib/helpers/collection"

// validations
import {
  createCollectionSchema,
  getCollectionsSchema
} from "@/lib/validations/collection-schema"

export const collectionRouter = createTRPCRouter({
  get: protectedProcedure
    .input(getCollectionsSchema)
    .query(async ({ ctx, input }): Promise<ClientCardCollection[]> => {
      const filter = parseCollectionFilter(input.filter)

      const collections = await ctx.db.cardCollection.findMany({
        where: {
          ...filter,
          NOT: input.excludeUser ? { userId: ctx.user.id } : undefined
        },
        orderBy: input.sort,
        include: {
          cards: true,
          user: true
        }
      })

      return collections.map((collection) => parseSchemaToClientCollection(collection))
    }),

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
