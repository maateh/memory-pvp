import type { z } from "zod"

// schemas
import { clientCardCollection } from "@/collection"

export const createCollectionUtValidation = clientCardCollection
  .pick({ name: true, description: true, tableSize: true })

export type CreateCardCollectionUtValidation = z.infer<typeof createCollectionUtValidation>
