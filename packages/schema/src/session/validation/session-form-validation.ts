import { z } from "zod"

// schemas
import { sessionSettings } from "@/session"

// validations
import { createRoomValidation } from "@/room/validation"
import { createSoloSessionValidation } from "@/session/validation"

export const createOfflineSessionValidation = z.object({
  settings: sessionSettings
    .omit({ format: true })
    .extend({ format: z.literal(sessionSettings.shape.format.enum.OFFLINE) }),
  forceStart: z.boolean().optional()
})
export const sessionFormValidation = z.object({
  settings: createSoloSessionValidation.shape.settings
    .or(createRoomValidation.shape.settings)
    .or(createOfflineSessionValidation.shape.settings),
  forceStart: z.boolean().optional()
})

export type CreateOfflineSessionValidation = z.infer<typeof createOfflineSessionValidation>
export type SessionFormValidation = z.infer<typeof sessionFormValidation>
