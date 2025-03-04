import { z } from "zod"

// schemas
import {
  baseClientSessionSchema,
  sessionCard,
  sessionSettings,
  offlineClientSessionSchema
} from "@/session-schema"
import { roomSettings } from "@/room-schema"
import { createRoomValidation } from "@/validation/room-validation"

/* Forms / API validations */
export const createSingleSessionValidation = z.object({
  settings: sessionSettings
    .omit({ mode: true })
    .extend({ mode: z.literal(sessionSettings.shape.mode.enum.SINGLE) }),
  forceStart: z.coerce.boolean().optional()
})

export const sessionFormValidation = z.object({
  settings: createSingleSessionValidation.shape.settings
    .or(createRoomValidation.shape.settings),
  forceStart: z.coerce.boolean().optional()
})

export const createMultiSessionValidation = z.object({
  settings: roomSettings,
  slug: z.string(),
  guestId: z.string()
})

export const saveSessionValidation = z.object({
  clientSession: baseClientSessionSchema.omit({
    owner: true,
    guest: true
  })
})

export const finishSessionSchema = z.object({
  clientSession: baseClientSessionSchema
    .omit({ status: true, cards: true })
    .extend({
      cards: z.array(sessionCard.extend({
        matchedBy: z.string()
      }))
    })
})

export const abandonSessionValidation = z.object({
  clientSession: baseClientSessionSchema
    .omit({ status: true })
    .optional()
})

export const saveOfflineGameValidation = z.object({
  playerId: z.string(),
  clientSession: offlineClientSessionSchema
    .omit({ cards: true })
    .extend({
      cards: z.array(sessionCard.extend({
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
