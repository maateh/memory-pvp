import { z } from "zod"

// schemas
import { roomPlayerSchema } from "@/player"
import { roomSchema, roomStatus } from "@/room"
import { multiplayerClientSession } from "@/session"

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

export type WaitingRoom = z.infer<typeof waitingRoomSchema>
export type JoinedRoom = z.infer<typeof joinedRoomSchema>
export type RunningRoom = z.infer<typeof runningRoomSchema>
export type FinishedRoom = z.infer<typeof finishedRoomSchema>

export type RoomVariants = WaitingRoom | JoinedRoom | RunningRoom | FinishedRoom
export type WaitingRoomVariants = WaitingRoom | JoinedRoom
