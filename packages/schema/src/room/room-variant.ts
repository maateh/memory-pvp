import { z } from "zod"

// schemas
import { roomPlayer } from "@/player"
import { room, roomStatus } from "@/room"
import { multiplayerClientSession } from "@/session"

export const waitingRoom = room
  .omit({ status: true, guest: true, session: true })
  .extend({ status: z.literal(roomStatus.enum.waiting) })

export const joinedRoom = room
  .omit({ status: true, guest: true, session: true })
  .extend({
    status: z.enum([
      roomStatus.enum.joined,
      roomStatus.enum.ready
    ]),
    guest: roomPlayer
  })

export const runningRoom = room
  .omit({ status: true, guest: true, session: true })
  .extend({
    status: z.enum([
      roomStatus.enum.running,
      roomStatus.enum.cancelled
    ]),
    guest: roomPlayer,
    session: multiplayerClientSession
  })

export const finishedRoom = room
  .omit({ status: true, guest: true, session: true })
  .extend({
    status: z.literal(roomStatus.enum.finished),
    guest: roomPlayer,
    session: multiplayerClientSession
  })

export type WaitingRoom = z.infer<typeof waitingRoom>
export type JoinedRoom = z.infer<typeof joinedRoom>
export type RunningRoom = z.infer<typeof runningRoom>
export type FinishedRoom = z.infer<typeof finishedRoom>

export type RoomVariants = WaitingRoom | JoinedRoom | RunningRoom | FinishedRoom
export type WaitingRoomVariants = WaitingRoom | JoinedRoom
