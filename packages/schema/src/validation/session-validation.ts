import { z } from "zod"

// schemas
import { clientSessionSchema } from "@/session-schema"

/* Forms / API validations */
export const createSessionSchema = clientSessionSchema.pick({
  type: true,
  mode: true,
  tableSize: true
}).extend({
  collectionId: z.string().optional(),
  forceStart: z.coerce.boolean().optional()
})
