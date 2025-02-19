import { z } from "zod"

// schemas
import { roomSettings } from "../room-schema"

/* Forms / API validations */
export const createRoomValidation = z.object({
  settings: roomSettings,
  forceStart: z.coerce.boolean().optional()
})

export const joinRoomValidation = z.object({
  roomSlug: z.string(),
  forceJoin: z.coerce.boolean().optional()
})

export type CreateRoomValidation = z.infer<typeof createRoomValidation>
export type JoinRoomValidation = z.infer<typeof joinRoomValidation>
