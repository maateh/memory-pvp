import { z } from "zod"

// schemas
import { createSessionValidation } from "./session-validation"
import { clientPlayerSchema } from "../player-schema"

/* Forms / API validations */
export const createSessionRoomValidation = z.object({
  owner: clientPlayerSchema,
  settings: createSessionValidation
})

export const joinSessionRoomValidation = z.object({
  roomSlug: z.string(),
  guest: clientPlayerSchema
})

export const readyRoomValidation = z.object({
  roomSlug: z.string()
})

export type CreateSessionRoomValidation = z.infer<typeof createSessionRoomValidation>
export type JoinSessionRoomValidation = z.infer<typeof joinSessionRoomValidation>
export type ReadyRoomValidation = z.infer<typeof readyRoomValidation>
