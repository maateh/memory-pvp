import { z } from "zod"

// schemas
import { roomSettings } from "@/room-schema"
import { clientSessionCard } from "@/session-schema"

/* Forms / API validations */
export const createRoomValidation = z.object({
  settings: roomSettings,
  forceStart: z.coerce.boolean().optional()
})

export const joinRoomValidation = z.object({
  roomSlug: z.string(),
  forceJoin: z.coerce.boolean().optional()
})

export const sessionCardFlipValidation = z.object({
  clickedCard: clientSessionCard
})

export type CreateRoomValidation = z.infer<typeof createRoomValidation>
export type JoinRoomValidation = z.infer<typeof joinRoomValidation>
export type SessionCardFlipValidation = z.infer<typeof sessionCardFlipValidation>
