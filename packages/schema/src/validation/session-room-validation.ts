import { z } from "zod"

// schemas
import { createSessionSchema } from "./session-validation"
import { clientPlayerSchema } from "../player-schema"

/* Base schemas */
export const createSessionRoomSchema = z.object({
  owner: clientPlayerSchema,
  settings: createSessionSchema
})

export type CreateSessionRoomValidation = z.infer<typeof createSessionRoomSchema>
