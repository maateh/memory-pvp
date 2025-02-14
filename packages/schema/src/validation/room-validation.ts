import { z } from "zod"

// schemas
import { clientPlayerSchema } from "../player-schema"
import { roomSettings } from "../room-schema"

/* Forms / API validations */
export const createSessionRoomValidation = roomSettings.extend({
  owner: clientPlayerSchema
})

export const joinSessionRoomValidation = z.object({
  roomSlug: z.string(),
  guest: clientPlayerSchema
})

export const sessionReconnectValidation = z.object({
  playerId: z.string()
})

export type CreateSessionRoomValidation = z.infer<typeof createSessionRoomValidation>
export type JoinSessionRoomValidation = z.infer<typeof joinSessionRoomValidation>
export type SessionReconnectValidation = z.infer<typeof sessionReconnectValidation>
