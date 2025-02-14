import { z } from "zod"

// schemas
import { roomSettings } from "../room-schema"

/* Forms / API validations */
export const createSessionRoomValidation = z.object({
  settings: roomSettings
})

export const joinSessionRoomValidation = z.object({
  roomSlug: z.string()
})

export type CreateSessionRoomValidation = z.infer<typeof createSessionRoomValidation>
export type JoinSessionRoomValidation = z.infer<typeof joinSessionRoomValidation>
