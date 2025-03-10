import { z } from "zod"

// db schemas
import { sessionCard, sessionCardMetadata, sessionStats } from "@repo/db/json-schema"
import {
  SessionStatusSchema,
  SessionModeSchema,
  MatchFormatSchema,
  TableSizeSchema
} from "@repo/db/zod"

// validations
import { clientPlayer } from "@/player-schema"

export const sessionSettings = z.object({
  mode: SessionModeSchema,
  format: MatchFormatSchema,
  tableSize: TableSizeSchema,
  collectionId: z.string()
})

export const clientSessionCard = sessionCard.extend({
  imageUrl: z.string()
})

export const baseClientSession = z.object({
  slug: z.string(),
  collectionId: z.string(),

  status: SessionStatusSchema,
  mode: sessionSettings.shape.mode,
  format: sessionSettings.shape.format,
  tableSize: sessionSettings.shape.tableSize,

  owner: clientPlayer,
  guest: clientPlayer.optional().nullable(),
  stats: sessionStats,
  cards: z.array(clientSessionCard),
  flipped: z.array(sessionCardMetadata),
  currentTurn: z.string(),

  startedAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  closedAt: z.coerce.date().optional().nullable()
})

export const offlineClientSession = baseClientSession
  .omit({ format: true, mode: true, guest: true })
  .extend({
    format: z.literal(sessionSettings.shape.format.enum.OFFLINE),
    mode: z.literal(sessionSettings.shape.mode.enum.CASUAL)
  })

export const soloClientSession = baseClientSession
  .omit({ format: true, guest: true })
  .extend({
    format: z.literal(sessionSettings.shape.format.enum.SOLO)
  })

export const singleplayerClientSession = offlineClientSession
  .or(soloClientSession)

export const multiplayerClientSession = baseClientSession
  .omit({ format: true, guest: true })
  .extend({
    format: z.enum([
      sessionSettings.shape.format.enum.COOP,
      sessionSettings.shape.format.enum.PVP
    ]),
    guest: clientPlayer
  })

export const clientSession = singleplayerClientSession
  .or(multiplayerClientSession)

export const offlineSessionStorage = offlineClientSession
  .omit({
    slug: true,
    status: true,
    mode: true,
    format: true,
    owner: true,
    currentTurn: true,
    closedAt: true
  })

export const offlineSessionMetadata = offlineClientSession
  .pick({
    slug: true,
    status: true,
    mode: true,
    format: true,
    owner: true,
    currentTurn: true
  })

export type SessionSettings = z.infer<typeof sessionSettings>
export type ClientSessionCard = z.infer<typeof clientSessionCard>

export type BaseClientSession = z.infer<typeof baseClientSession>
export type OfflineClientSession = z.infer<typeof offlineClientSession>
export type SoloClientSession = z.infer<typeof soloClientSession>
export type MultiplayerClientSession = z.infer<typeof multiplayerClientSession>
export type ClientSession = z.infer<typeof clientSession>

export type OfflineSessionStorage = z.infer<typeof offlineSessionStorage>
export type OfflineSessionMetadata = z.infer<typeof offlineSessionMetadata>
