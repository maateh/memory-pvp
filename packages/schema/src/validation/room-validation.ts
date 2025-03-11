import { z } from "zod"

// schemas
import { roomSettings } from "@/room-schema"
import { clientSessionCard } from "@/session-schema"

export const createRoomValidation = z.object({
  settings: roomSettings
})

export const joinRoomValidation = z.object({
  roomSlug: z.string()
})

export const sessionCardFlipValidation = z.object({
  clickedCard: clientSessionCard
})

export type CreateRoomValidation = z.infer<typeof createRoomValidation>
export type JoinRoomValidation = z.infer<typeof joinRoomValidation>
export type SessionCardFlipValidation = z.infer<typeof sessionCardFlipValidation>
