import { z } from "zod"

// schemas
import { clientPlayer } from "@/player"
import { clientSession } from "@/session"

export const offlineClientSession = clientSession
  .omit({ format: true, mode: true, guest: true })
  .extend({
    format: z.literal(clientSession.shape.format.enum.OFFLINE),
    mode: z.literal(clientSession.shape.mode.enum.CASUAL),
    guest: z.never().optional().nullable()
  })

export const soloClientSession = clientSession
  .omit({ format: true, guest: true })
  .extend({
    format: z.literal(clientSession.shape.format.enum.SOLO),
    guest: z.never().optional().nullable()
  })

export const singleplayerClientSession = offlineClientSession
  .or(soloClientSession)

export const multiplayerClientSession = clientSession
  .omit({ format: true, guest: true })
  .extend({
    format: z.enum([
      clientSession.shape.format.enum.COOP,
      clientSession.shape.format.enum.PVP
    ]),
    guest: clientPlayer
  })

export const clientSessionVariants = singleplayerClientSession
  .or(multiplayerClientSession)

export type OfflineClientSession = z.infer<typeof offlineClientSession>
export type SoloClientSession = z.infer<typeof soloClientSession>
export type SingleplayerClientSession = z.infer<typeof singleplayerClientSession>
export type MultiplayerClientSession = z.infer<typeof multiplayerClientSession>
export type ClientSessionVariants = z.infer<typeof clientSessionVariants>
