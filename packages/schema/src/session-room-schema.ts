import { z } from "zod"

// schemas
import { clientPlayerSchema } from "./player-schema"
import { clientSessionSchema } from "./session-schema"
import { createSessionSchema } from "./validation/session-validation"

/* Base schemas */
export const sessionRoomStatusSchema = z.enum(["waiting", "joined", "ready", "starting", "running", "finished"])

export const sessionRoomSchema = z.object({
  slug: z.string(),
  status: sessionRoomStatusSchema,
  owner: clientPlayerSchema,
  guest: clientPlayerSchema,
  session: clientSessionSchema,
  createdAt: z.coerce.date()
})

/* Custom room types based on room status */
export const waitingRoomSchema = sessionRoomSchema
  .omit({
    status: true,
    guest: true,
    session: true
  })
  .extend({
    status: z.literal(sessionRoomStatusSchema.enum.waiting),
    settings: createSessionSchema
  })

export const joinedRoomSchema = sessionRoomSchema
  .omit({
    status: true,
    owner: true,
    guest: true,
    session: true
  })
  .extend({
    status: z.literal(sessionRoomStatusSchema.enum.joined),
    owner: clientPlayerSchema.extend({ ready: z.literal(false) }),
    guest: clientPlayerSchema.extend({ ready: z.literal(false) }),
    settings: createSessionSchema
  })

export type SessionRoomStatus = z.infer<typeof sessionRoomStatusSchema>
export type SessionRoom = z.infer<typeof sessionRoomSchema>
export type WaitingRoom = z.infer<typeof waitingRoomSchema>
export type JoinedRoom = z.infer<typeof joinedRoomSchema>
