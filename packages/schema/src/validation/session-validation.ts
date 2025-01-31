import { z } from "zod"

// schemas
import { sessionSettings } from "../session-schema"
import { createSessionRoomValidation } from "./session-room-validation"
import { sessionRoomSettings } from "../session-room-schema"

/* Forms / API validations */
export const createSingleSessionValidation = sessionSettings
  .omit({ mode: true })
  .extend({
    mode: z.literal(sessionSettings.shape.mode.enum.SINGLE),
    forceStart: z.coerce.boolean().optional()
  })

export const createMultiSessionValidation = sessionRoomSettings
  .extend({
    slug: z.string(),
    guestId: z.string()
  })

export const sessionFormValidation = createSingleSessionValidation.or(createSessionRoomValidation)

export type CreateSingleSessionValidation = z.infer<typeof createSingleSessionValidation>
export type CreateMultiSessionValidation = z.infer<typeof createMultiSessionValidation>
export type SessionFormValidation = z.infer<typeof sessionFormValidation>
