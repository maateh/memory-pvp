import { z } from "zod"

// schemas
import { roomPlayerSchema } from "./room-player-schema"
import { multiClientSessionSchema, sessionSettings } from "./session-schema"

/* Base schemas */
export const roomStatus = z.enum(["waiting", "joined", "ready", "starting", "running", "finished"])
export const roomConnectionStatus = z.enum(["offline", "half_online", "online"])

export const roomSettings = sessionSettings
  .omit({ mode: true })
  .extend({
    mode: z.enum([
      sessionSettings.shape.mode.enum.COOP,
      sessionSettings.shape.mode.enum.PVP
    ])
  })

export const roomSchema = z.object({
  slug: z.string(),
  status: roomStatus,
  connectionStatus: roomConnectionStatus,
  owner: roomPlayerSchema,
  guest: roomPlayerSchema,
  settings: roomSettings,
  session: multiClientSessionSchema, // TODO: must be replaced by db schema
  createdAt: z.coerce.date()
  // TODO: add & track `updatedAt`
})

/* Custom room types based on room status */
export const waitingRoomSchema = roomSchema
  .omit({
    status: true,
    guest: true,
    session: true
  })
  .extend({
    status: z.literal(roomStatus.enum.waiting)
  })

export const joinedRoomSchema = roomSchema
  .omit({
    status: true,
    session: true
  })
  .extend({
    status: z.enum([
      roomStatus.enum.joined,
      roomStatus.enum.ready,
      roomStatus.enum.starting
    ])
  })

export const runningRoomSchema = roomSchema
  .omit({
    status: true,
    session: true
  })
  .extend({
    status: z.literal(roomStatus.enum.running)
  })

export type RoomStatus = z.infer<typeof roomStatus>
export type RoomConnectionStatus = z.infer<typeof roomConnectionStatus>
export type RoomSettings = z.infer<typeof roomSettings>

export type Room = z.infer<typeof roomSchema>
export type WaitingRoom = z.infer<typeof waitingRoomSchema>
export type JoinedRoom = z.infer<typeof joinedRoomSchema>
export type RunningRoom = z.infer<typeof runningRoomSchema>

export type WaitingRoomVariants = WaitingRoom | JoinedRoom
export type RoomVariants = WaitingRoom | JoinedRoom | RunningRoom | Room
