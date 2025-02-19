import { z } from "zod"

// schemas
import { clientSessionSchema, sessionCardSchema, sessionSettings } from "../session-schema"
import { roomSettings } from "../room-schema"
import { createSessionRoomValidation } from "./room-validation"

/* Forms / API validations */
export const createSingleSessionValidation = z.object({
  settings: sessionSettings
    .omit({ mode: true })
    .extend({ mode: z.literal(sessionSettings.shape.mode.enum.SINGLE) }),
  forceStart: z.coerce.boolean().optional()
})

export const sessionFormValidation = z.object({
  settings: createSingleSessionValidation.shape.settings
    .or(createSessionRoomValidation.shape.settings),
  forceStart: z.coerce.boolean().optional()
})

export const createMultiSessionValidation = z.object({
  settings: roomSettings,
  slug: z.string(),
  guestId: z.string()
})

export const saveSessionValidation = z.object({
  clientSession: clientSessionSchema.omit({ players: true })
})

export const finishSessionSchema = z.object({
  clientSession: clientSessionSchema
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
})

export const abandonSessionValidation = z.object({
  clientSession: clientSessionSchema
    .omit({ status: true, players: true })
    .optional()
})

export const saveOfflineGameValidation = z.object({
  playerId: z.string(),
  clientSession: clientSessionSchema
    .omit({
      slug: true,
      type: true,
      mode: true,
      status: true,
      players: true,
      cards: true
    })
    .extend({
      cards: z.array(sessionCardSchema.extend({
        matchedBy: z.string()
      }))
    })
})

export type CreateSingleSessionValidation = z.infer<typeof createSingleSessionValidation>
export type SessionFormValidation = z.infer<typeof sessionFormValidation>
export type CreateMultiSessionValidation = z.infer<typeof createMultiSessionValidation>
export type SaveSessionValidation = z.infer<typeof saveSessionValidation>
export type FinishSessionValidation = z.infer<typeof finishSessionSchema>
export type AbandonSessionValidation = z.infer<typeof abandonSessionValidation>
export type SaveOfflineGameValidation = z.infer<typeof saveOfflineGameValidation>
