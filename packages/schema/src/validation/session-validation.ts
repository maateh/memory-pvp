import { z } from "zod"

// schemas
import { clientSessionSchema, sessionMode } from "../session-schema"
import { sessionRoomSettings } from "../session-room-schema"

/* Forms / API validations */
export const createSingleSessionValidation = clientSessionSchema
  .pick({
    type: true,
    tableSize: true,
    collectionId: true
  })
  .extend({
    mode: z.literal(sessionMode.enum.SINGLE),
    forceStart: z.coerce.boolean().optional()
  })

export const createMultiSessionValidation = sessionRoomSettings.extend({
  guestId: z.string()
})

export const createSessionValidation = createSingleSessionValidation.or(createMultiSessionValidation)

export type CreateSingleSessionValidation = z.infer<typeof createSingleSessionValidation>
export type CreateMultiSessionValidation = z.infer<typeof createMultiSessionValidation>
export type CreateSessionValidation = z.infer<typeof createSessionValidation>
