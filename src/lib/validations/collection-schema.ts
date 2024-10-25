import { z } from "zod"

// prisma
import { TableSize } from "@prisma/client"

// constants
import {
  collectionAcceptedMimeTypes,
  collectionMaxFileSize,
  collectionMaxFileSizeInBytes,
  collectionMaxSizeMap,
  collectionMinSizeMap
} from "@/constants/collection"

/** Base schemas */
const collectionNameSchema = z.string()
  .min(4, { message: 'Collection name is too short.' })
  .max(16, { message: 'Collection name is too long.' })

const collectionDescriptionSchema = z.string()
  .min(10, { message: 'Collection description is too short.' })
  .max(100, { message: 'Collection description is too long.' })

const collectionCardImage = z.custom<File>()
  .refine((file: File) => file.size <= collectionMaxFileSizeInBytes, {
    message: `Maximum image size is ${collectionMaxFileSize}`
  })
  .refine((file: File) => collectionAcceptedMimeTypes.includes(file.type), {
    message: "Uploaded image file format is not supported."
  })

const utImageSchema = z.object({
  utKey: z.string(),
  imageUrl: z.string().url({ message: "Card image URL is invalid." })
})

/** Forms / API validations */
export const createCollectionUtSchema = z.object({
  name: collectionNameSchema,
  description: collectionDescriptionSchema,
  tableSize: z.nativeEnum(TableSize)
})

export const createCollectionSchema = createCollectionUtSchema.extend({
  utImages: z.array(utImageSchema)
})

/** Client side form validation */
export const createCollectionClientSchema = createCollectionUtSchema.extend({
  images: z.array(collectionCardImage)
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