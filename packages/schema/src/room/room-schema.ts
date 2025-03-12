import { z } from "zod"

// schemas
import { roomPlayer } from "@/player"
import { multiplayerClientSession, sessionSettings } from "@/session"

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

export const room = z.object({
  slug: z.string(),
  status: roomStatus,
  connectionStatus: roomConnectionStatus,
  owner: roomPlayer,
  guest: roomPlayer.nullable(),
  settings: roomSettings,
  session: multiplayerClientSession.nullable(),
  createdAt: z.coerce.date()
  // TODO: add & track `updatedAt`
})

export type RoomStatus = z.infer<typeof roomStatus>
export type RoomConnectionStatus = z.infer<typeof roomConnectionStatus>
export type RoomSettings = z.infer<typeof roomSettings>
export type Room = z.infer<typeof room>
