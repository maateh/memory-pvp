import { z } from "zod"

// schemas
import { roomPlayerSchema } from "@/room-player-schema"
import { multiplayerClientSession, sessionSettings } from "@/session-schema"

export const roomStatus = z.enum(["waiting", "joined", "ready", "running", "cancelled", "finished"])
export const roomConnectionStatus = z.enum(["offline", "half_online", "online"])

export const roomSettings = sessionSettings
  .omit({ format: true })
  .extend({
    format: z.enum([
      sessionSettings.shape.format.enum.COOP,
      sessionSettings.shape.format.enum.PVP
    ])
  })

export const roomSchema = z.object({
  slug: z.string(),
  status: roomStatus,
  connectionStatus: roomConnectionStatus,
  owner: roomPlayerSchema,
  guest: roomPlayerSchema.nullable(),
  settings: roomSettings,
  session: multiplayerClientSession.nullable(),
  createdAt: z.coerce.date()
  // TODO: add & track `updatedAt`
})

/* Custom room types based on room status */
export const waitingRoomSchema = roomSchema
  .omit({ status: true, guest: true, session: true })
  .extend({ status: z.literal(roomStatus.enum.waiting) })

export const joinedRoomSchema = roomSchema
  .omit({ status: true, guest: true, session: true })
  .extend({
    status: z.enum([
      roomStatus.enum.joined,
      roomStatus.enum.ready
    ]),
    guest: roomPlayerSchema
  })

export const runningRoomSchema = roomSchema
  .omit({ status: true, guest: true, session: true })
  .extend({
    status: z.enum([
      roomStatus.enum.running,
      roomStatus.enum.cancelled
    ]),
    guest: roomPlayerSchema,
    session: multiplayerClientSession
  })

export const finishedRoomSchema = roomSchema
  .omit({ status: true, guest: true, session: true })
  .extend({
    status: z.literal(roomStatus.enum.finished),
    guest: roomPlayerSchema,
    session: multiplayerClientSession
  })

export type RoomStatus = z.infer<typeof roomStatus>
export type RoomConnectionStatus = z.infer<typeof roomConnectionStatus>
export type RoomSettings = z.infer<typeof roomSettings>

export type Room = z.infer<typeof roomSchema>
export type WaitingRoom = z.infer<typeof waitingRoomSchema>
export type JoinedRoom = z.infer<typeof joinedRoomSchema>
export type RunningRoom = z.infer<typeof runningRoomSchema>
export type FinishedRoom = z.infer<typeof finishedRoomSchema>

export type RoomVariants = WaitingRoom | JoinedRoom | RunningRoom | FinishedRoom
export type WaitingRoomVariants = WaitingRoom | JoinedRoom
