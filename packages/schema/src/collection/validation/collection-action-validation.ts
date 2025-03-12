import { z } from "zod"

// schemas
import {
  collectionDescriptionSchema,
  collectionNameSchema
} from "@/collection"

// validations
import { createCollectionUtValidation } from "@/collection/validation"

export const createCollectionValidation = createCollectionUtValidation.extend({
  utImages: z.array(
    z.object({
      utKey: z.string(),
      imageUrl: z.string().url({ message: "Card image URL is invalid." })
    })
  )
})

export const updateCollectionValidation = z.object({
  id: z.string(),
  name: collectionNameSchema.optional(),
  description: collectionDescriptionSchema.optional()
})

export const deleteCollectionSchema = z.object({
  id: z.string()
})

export type CreateCardCollectionValidation = z.infer<typeof createCollectionValidation>
export type UpdateCardCollectionValidation = z.infer<typeof updateCollectionValidation>
