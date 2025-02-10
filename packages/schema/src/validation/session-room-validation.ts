import { z } from "zod"

// schemas
import { clientPlayerSchema } from "../player-schema"
import { sessionRoomSettings } from "../session-room-schema"

/* Forms / API validations */
export const roomConnectValidation = z.object({
  playerId: z.string()
})

export const createSessionRoomValidation = sessionRoomSettings.extend({
  owner: clientPlayerSchema
})

export const joinSessionRoomValidation = z.object({
  roomSlug: z.string(),
  guest: clientPlayerSchema
})

export const sessionCreatedValidation = z.object({
  roomSlug: z.string()
})

export const sessionReconnectValidation = z.object({
  playerId: z.string()
})

export type RoomConnectValidation = z.infer<typeof roomConnectValidation>
export type CreateSessionRoomValidation = z.infer<typeof createSessionRoomValidation>
export type JoinSessionRoomValidation = z.infer<typeof joinSessionRoomValidation>
export type SessionCreatedValidation = z.infer<typeof sessionCreatedValidation>
export type SessionReconnectValidation = z.infer<typeof sessionReconnectValidation>
