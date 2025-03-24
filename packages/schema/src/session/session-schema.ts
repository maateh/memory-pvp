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

export const sessionSettings = z.object({
  mode: SessionModeSchema,
  format: MatchFormatSchema,
  tableSize: TableSizeSchema,
  collectionId: z.string()
})

export const clientSessionCard = sessionCard.extend({
  imageUrl: z.string()
})

export const clientSession = z.object({
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

export const sessionStateUpdater = clientSession
  .pick({
    currentTurn: true,
    cards: true,
    flipped: true,
    stats: true
  })

export type SessionSettings = z.infer<typeof sessionSettings>
export type ClientSessionCard = z.infer<typeof clientSessionCard>
export type ClientSession = z.infer<typeof clientSession>
export type SessionStateUpdater = z.infer<typeof sessionStateUpdater>
