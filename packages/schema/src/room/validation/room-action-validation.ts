import { z } from "zod"

// schemas
import { roomSettings } from "@/room"

export const createRoomValidation = z.object({
  settings: roomSettings
})

export const joinRoomValidation = z.object({
  roomSlug: z.string()
})

export type CreateRoomValidation = z.infer<typeof createRoomValidation>
export type JoinRoomValidation = z.infer<typeof joinRoomValidation>
