import { z } from "zod"

// config
import { collectionMaxSizeMap, collectionMinSizeMap } from "@/config/collection-settings"

// schemas
import { collectionCardImageSchema } from "@/lib/schema/collection"

// validations
import { createCollectionUtValidation } from "@repo/schema/collection-validation"

export const createClientCollectionValidation = createCollectionUtValidation
  .extend({ images: z.array(collectionCardImageSchema) })
  .superRefine((collection, ctx) => {
    const { tableSize, images } = collection

    const min = collectionMinSizeMap[tableSize]
    const max = collectionMaxSizeMap[tableSize]

    if (images.length < min) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `You have uploaded less card image to this collection than are required for this table size. (Min.: ${min})`,
        path: ["images"]
      })
    }

    if (images.length > max) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `You have uploaded more card image to this collection than are allowed for this table size. (Max.: ${min})`,
        path: ["images"]
      })
    }
  })

export type CreateClientCardCollectionValidation = z.infer<typeof createClientCollectionValidation>
