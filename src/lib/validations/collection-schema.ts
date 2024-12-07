import { z } from "zod"

// prisma
import { TableSize } from "@prisma/client"

// config
import {
  collectionAcceptedMimeTypes,
  collectionMaxFileSize,
  collectionMaxFileSizeInBytes,
  collectionMaxSizeMap,
  collectionMinSizeMap
} from "@/config/collection-settings"

/* Base schemas */
const collectionNameSchema = z.string()
  .min(4, { message: 'Collection name is too short.' })
  .max(28, { message: 'Collection name is too long.' })

const collectionDescriptionSchema = z.string()
  .min(8, { message: 'Collection description is too short.' })
  .max(128, { message: 'Collection description is too long.' })

const collectionCardImageSchema = z.custom<File>()
  .refine((file: File) => file.size <= collectionMaxFileSizeInBytes, {
    message: `Maximum image size is ${collectionMaxFileSize}`
  })
  .refine((file: File) => collectionAcceptedMimeTypes.includes(file.type), {
    message: "Uploaded image file format is not supported."
  })

/* Query filters */
export const collectionFilterSchema = z.object({
  username: z.string(),
  name: z.string(),
  tableSize: z.nativeEnum(TableSize),
  includeUser: z.coerce.boolean().optional()
}).partial().optional().default({})

const sortKeys = z.enum(['asc', 'desc']).optional()
export const collectionSortSchema = z.object({
  name: sortKeys,
  createdAt: sortKeys
}).partial().optional().default({})

/* Form / API validations */
export const createCollectionUtSchema = z.object({
  name: collectionNameSchema,
  description: collectionDescriptionSchema,
  tableSize: z.nativeEnum(TableSize)
})

export const createCollectionSchema = createCollectionUtSchema.extend({
  utImages: z.array(
    z.object({
      utKey: z.string(),
      imageUrl: z.string().url({ message: "Card image URL is invalid." })
    })
  )
})

export const updateCollectionSchema = z.object({
  id: z.string(),
  name: collectionNameSchema.optional(),
  description: collectionDescriptionSchema.optional()
})

export const deleteCollectionSchema = z.object({
  id: z.string()
})

/* Client side form validation */
export const createCollectionClientSchema = createCollectionUtSchema.extend({
  images: z.array(collectionCardImageSchema)
}).superRefine((collection, ctx) => {
  const { tableSize, images } = collection
  
  const min = collectionMinSizeMap[tableSize]
  const max = collectionMaxSizeMap[tableSize]

  if (images.length < min) {
    return ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `You have uploaded less card image to this collection than are required for this table size. (Min.: ${min})`,
      path: ['images']
    })
  }

  if (images.length > max) {
    return ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `You have uploaded more card image to this collection than are allowed for this table size. (Max.: ${min})`,
      path: ['images']
    })
  }
})
