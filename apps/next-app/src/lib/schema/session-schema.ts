import { z } from "zod"

// schemas
import { sessionCardMetadataSchema, clientSessionSchema } from "@repo/schema/session"

/* Base schemas */
export const matchedCardSchema = sessionCardMetadataSchema.extend({
  flippedBy: z.string().nullable(), // TODO: remove `flippedBy` -> track flipped cards only inside the `flipped` array
  matchedBy: z.string()
})

/* Client base schemas */
export const unsignedClientSessionSchema = clientSessionSchema.omit({
  slug: true,
  type: true,
  mode: true,
  status: true,
  closedAt: true
})

export * from "@repo/schema/session"
