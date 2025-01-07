import { z } from "zod"

// schemas
import { createSessionSchema } from "./session-validation"
import { clientPlayerSchema } from "../player-schema"

/* Forms / API validations */
export const createSessionRoomSchema = z.object({
  owner: clientPlayerSchema,
  settings: createSessionSchema
})

export const joinSessionRoomSchema = z.object({
  roomSlug: z.string(),
  guest: clientPlayerSchema
})

export type CreateSessionRoomValidation = z.infer<typeof createSessionRoomSchema>
export type JoinSessionRoomValidation = z.infer<typeof joinSessionRoomSchema>
