import { z } from "zod"

// schemas
import { clientSessionSchema, matchedCardSchema } from "@/lib/schema/session-schema"

/* Forms / API validations */
export const saveSessionValidation = clientSessionSchema.omit({ players: true })

export const finishSessionSchema = clientSessionSchema.extend({
  cards: z.array(matchedCardSchema)
}).omit({
  status: true,
  players: true
})

export const abandonSessionValidation = clientSessionSchema.omit({
  status: true,
  players: true
}).optional()

export const saveOfflineGameValidation = clientSessionSchema.extend({
  playerId: z.string(),
  cards: z.array(matchedCardSchema)
}).omit({
  slug: true,
  type: true,
  mode: true,
  status: true,
  players: true
})

export type SaveSessionValidation = z.infer<typeof saveSessionValidation>
export type FinishSessionValidation = z.infer<typeof finishSessionSchema>
export type AbandonSessionValidation = z.infer<typeof abandonSessionValidation>
export type SaveOfflineGameValidation = z.infer<typeof saveOfflineGameValidation>

/* Shared re-exports */
export * from "@repo/schema/session-validation"
export type * from "@repo/schema/session-validation"
