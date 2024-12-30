import { z } from "zod"

// config
import { collectionMaxSizeMap, collectionMinSizeMap } from "@/config/collection-settings"

// schemas
import {
  clientCollectionSchema,
  collectionCardImageSchema,
  collectionDescriptionSchema,
  collectionNameSchema
} from "@/lib/schema/collection-schema"

/* Form / API validations */
export const createCollectionUtSchema = clientCollectionSchema.pick({
  name: true,
  description: true,
  tableSize: true
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
