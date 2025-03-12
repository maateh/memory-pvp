import { z } from "zod"

// schemas
import { clientPlayer } from "@/player"
import { baseClientSession } from "@/session"

export const offlineClientSession = baseClientSession
  .omit({ format: true, mode: true, guest: true })
  .extend({
    format: z.literal(baseClientSession.shape.format.enum.OFFLINE),
    mode: z.literal(baseClientSession.shape.mode.enum.CASUAL)
  })

export const soloClientSession = baseClientSession
  .omit({ format: true, guest: true })
  .extend({
    format: z.literal(baseClientSession.shape.format.enum.SOLO)
  })

export const singleplayerClientSession = offlineClientSession
  .or(soloClientSession)

export const multiplayerClientSession = baseClientSession
  .omit({ format: true, guest: true })
  .extend({
    format: z.enum([
      baseClientSession.shape.format.enum.COOP,
      baseClientSession.shape.format.enum.PVP
    ]),
    guest: clientPlayer
  })

export const clientSession = singleplayerClientSession
  .or(multiplayerClientSession)

export type OfflineClientSession = z.infer<typeof offlineClientSession>
export type SoloClientSession = z.infer<typeof soloClientSession>
export type SingleplayerClientSession = z.infer<typeof singleplayerClientSession>
export type MultiplayerClientSession = z.infer<typeof multiplayerClientSession>
export type ClientSession = z.infer<typeof clientSession>
