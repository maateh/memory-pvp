import { z } from "zod"

// schemas
import {
  collectionDescription,
  collectionName
} from "@/collection"

// validations
import { createCollectionUtValidation } from "@/collection/validation"

export const createCollectionValidation = z.object({
  utImages: z.array(
    z.object({
      utKey: z.string(),
      imageUrl: z.string().url({ message: "Card image URL is invalid." })
    })
  )
}).extend(createCollectionUtValidation.shape)

export const updateCollectionValidation = z.object({
  id: z.string(),
  name: collectionName.optional(),
  description: collectionDescription.optional()
})

export const deleteCollectionValidation = z.object({
  id: z.string()
})

export type CreateCollectionValidation = z.infer<typeof createCollectionValidation>
export type UpdateCollectionValidation = z.infer<typeof updateCollectionValidation>
export type DeleteCollectionValidation = z.infer<typeof deleteCollectionValidation>
