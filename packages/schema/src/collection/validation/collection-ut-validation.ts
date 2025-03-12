import type { z } from "zod"

// schemas
import { clientCollectionSchema } from "@/collection"

export const createCollectionUtValidation = clientCollectionSchema
  .pick({ name: true, description: true, tableSize: true })

export type CreateCardCollectionUtValidation = z.infer<typeof createCollectionUtValidation>
