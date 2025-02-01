import { z } from "zod"

// schemas
import { clientSessionSchema, sessionCardSchema } from "@/lib/schema/session-schema"

/* Forms / API validations */
export const saveSessionValidation = clientSessionSchema.omit({ players: true })

export const finishSessionSchema = clientSessionSchema
  .omit({
    status: true,
    players: true,
    cards: true
  })
  .extend({
    cards: z.array(sessionCardSchema.extend({
      matchedBy: z.string()
    }))
  })

export const abandonSessionValidation = clientSessionSchema
  .omit({ status: true, players: true })
  .optional()

export const saveOfflineGameValidation = clientSessionSchema
  .omit({
    slug: true,
    type: true,
    mode: true,
    status: true,
    players: true,
    cards: true
  })
  .extend({
    playerId: z.string(),
    cards: z.array(sessionCardSchema.extend({
      matchedBy: z.string()
    }))
  })

export type SaveSessionValidation = z.infer<typeof saveSessionValidation>
export type FinishSessionValidation = z.infer<typeof finishSessionSchema>
export type AbandonSessionValidation = z.infer<typeof abandonSessionValidation>
export type SaveOfflineGameValidation = z.infer<typeof saveOfflineGameValidation>

/* Shared re-exports */
export * from "@repo/schema/session-validation"
export type * from "@repo/schema/session-validation"
