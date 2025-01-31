import { z } from "zod"

// schemas
import { clientPlayerSchema } from "./player-schema"
import { clientSessionSchema, sessionSettings } from "./session-schema"

/* Base schemas */
export const sessionRoomStatusSchema = z.enum(["waiting", "joined", "ready", "starting", "running", "finished"])
export const sessionRoomPlayer = clientPlayerSchema.extend({
  socketId: z.string(),
  ready: z.coerce.boolean()
})

export const sessionRoomSettings = sessionSettings
  .omit({ mode: true })
  .extend({
    mode: z.enum([
      sessionSettings.shape.mode.enum.COOP,
      sessionSettings.shape.mode.enum.PVP
    ])
  })

export const sessionRoomSchema = z.object({
  slug: z.string(),
  status: sessionRoomStatusSchema,
  owner: sessionRoomPlayer,
  guest: sessionRoomPlayer,
  settings: sessionRoomSettings,
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
    status: z.literal(sessionRoomStatusSchema.enum.waiting)
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
    ])
  })

export type SessionRoomStatus = z.infer<typeof sessionRoomStatusSchema>
export type SessionRoomPlayer = z.infer<typeof sessionRoomPlayer>
export type SessionRoomSettings = z.infer<typeof sessionRoomSettings>
export type SessionRoom = z.infer<typeof sessionRoomSchema>
export type WaitingRoom = z.infer<typeof waitingRoomSchema>
export type JoinedRoom = z.infer<typeof joinedRoomSchema>
