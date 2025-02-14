import { z } from "zod"

// schemas
import { clientSessionSchema, sessionCardSchema, sessionSettings } from "../session-schema"
import { createSessionRoomValidation } from "./room-validation"
import { roomSettings } from "../room-schema"

/* Forms / API validations */
export const createSingleSessionValidation = sessionSettings
  .omit({ mode: true })
  .extend({
    mode: z.literal(sessionSettings.shape.mode.enum.SINGLE),
    forceStart: z.coerce.boolean().optional()
  })

export const createMultiSessionValidation = roomSettings
  .extend({
    slug: z.string(),
    guestId: z.string()
  })

export const sessionFormValidation = createSingleSessionValidation.or(createSessionRoomValidation)

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

export type CreateSingleSessionValidation = z.infer<typeof createSingleSessionValidation>
export type CreateMultiSessionValidation = z.infer<typeof createMultiSessionValidation>
export type SessionFormValidation = z.infer<typeof sessionFormValidation>
export type SaveSessionValidation = z.infer<typeof saveSessionValidation>
export type FinishSessionValidation = z.infer<typeof finishSessionSchema>
export type AbandonSessionValidation = z.infer<typeof abandonSessionValidation>
export type SaveOfflineGameValidation = z.infer<typeof saveOfflineGameValidation>
