import { z } from "zod"

// schemas
import { clientSessionSchema, matchedCardSchema } from "@/lib/schema/session-schema"

/* Forms / API validations */
export const createSessionSchema = clientSessionSchema.pick({
  type: true,
  mode: true,
  tableSize: true
}).extend({
  collectionId: z.string().optional(),
  forceStart: z.coerce.boolean().optional()
})

export const saveSessionSchema = clientSessionSchema.omit({ players: true })

export const finishSessionSchema = clientSessionSchema.extend({
  cards: z.array(matchedCardSchema)
}).omit({
  status: true,
  players: true
})

export const abandonSessionSchema = clientSessionSchema.omit({
  status: true,
  players: true
}).optional()

export const saveOfflineGameSchema = clientSessionSchema.extend({
  playerId: z.string(),
  cards: z.array(matchedCardSchema)
}).omit({
  slug: true,
  type: true,
  mode: true,
  status: true,
  players: true
})
