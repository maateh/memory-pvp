import { z } from "zod"

// schemas
import { sessionCard, sessionCardMetadata, sessionStats } from "@repo/db/json-schema"
import {
  SessionStatusSchema,
  SessionModeSchema,
  MatchFormatSchema,
  TableSizeSchema
} from "@repo/db/zod"
import { clientPlayer } from "@/player"
import { offlineClientSession } from "@/session"

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

// TODO: these last two might be better to move directly to the next application
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

export type OfflineSessionStorage = z.infer<typeof offlineSessionStorage>
export type OfflineSessionMetadata = z.infer<typeof offlineSessionMetadata>
