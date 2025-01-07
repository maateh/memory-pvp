import { z } from "zod"

// schemas
import { clientPlayerSchema } from "./player-schema"
import { clientSessionSchema } from "./session-schema"
import { createSessionSchema } from "./validation/session-validation"

/* Base schemas */
export const sessionRoomStatusSchema = z.enum(["waiting", "joined", "ready", "starting", "running", "finished"])
export const sessionRoomPlayer = clientPlayerSchema.extend({ ready: z.coerce.boolean() })

export const sessionRoomSchema = z.object({
  slug: z.string(),
  status: sessionRoomStatusSchema,
  owner: sessionRoomPlayer,
  guest: sessionRoomPlayer,
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
    session: true
  })
  .extend({
    status: z.enum([
      sessionRoomStatusSchema.enum.joined,
      sessionRoomStatusSchema.enum.ready,
      sessionRoomStatusSchema.enum.starting
    ]),
    settings: createSessionSchema
  })

export type SessionRoomStatus = z.infer<typeof sessionRoomStatusSchema>
export type SessionRoom = z.infer<typeof sessionRoomSchema>
export type WaitingRoom = z.infer<typeof waitingRoomSchema>
export type JoinedRoom = z.infer<typeof joinedRoomSchema>
