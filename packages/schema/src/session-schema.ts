import { z } from "zod"

// db schemas
import {
  GameModeSchema,
  GameStatusSchema,
  GameTypeSchema,
  TableSizeSchema
} from "@repo/db/zod"

// validations
import { clientPlayerSchema } from "./player-schema"

/* Base schemas */
export const sessionSettings = z.object({
  type: GameTypeSchema,
  mode: GameModeSchema,
  tableSize: TableSizeSchema,
  collectionId: z.string()
})

export const sessionCardMetadata = z.object({
  id: z.string(),
  key: z.coerce.number()
})

export const sessionCard = sessionCardMetadata.extend({
  matchedBy: z.string().nullable()
})

export const sessionStatsSchema = z.object({
  timer: z.coerce.number(),
  flips: z.record(
    z.string(), z.coerce.number()
  ),
  matches: z.record(
    z.string(), z.coerce.number()
  )
})

/* Client base schemas */
export const clientSessionCard = sessionCard.extend({
  imageUrl: z.string()
})

export const baseClientSessionSchema = z.object({
  slug: z.string(),
  collectionId: z.string(),

  status: GameStatusSchema,
  type: sessionSettings.shape.type,
  mode: sessionSettings.shape.mode,
  tableSize: sessionSettings.shape.tableSize,

  currentPlayerId: z.string(),
  owner: clientPlayerSchema,
  guest: clientPlayerSchema.optional().nullable(),
  stats: sessionStatsSchema,
  cards: z.array(clientSessionCard),
  flipped: z.array(sessionCardMetadata),

  startedAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  continuedAt: z.coerce.date().optional().nullable(),
  closedAt: z.coerce.date().optional().nullable()
})

export const singleClientSessionSchema = baseClientSessionSchema
  .omit({ mode: true, guest: true })
  .extend({
    mode: z.literal(sessionSettings.shape.mode.enum.SINGLE)
  })

export const multiClientSessionSchema = baseClientSessionSchema
  .omit({ mode: true, guest: true })
  .extend({
    mode: z.enum([
      sessionSettings.shape.mode.enum.COOP,
      sessionSettings.shape.mode.enum.PVP
    ]),
    guest: clientPlayerSchema
  })

export const clientSessionSchema = singleClientSessionSchema
  .or(multiClientSessionSchema)

export const offlineClientSessionSchema = baseClientSessionSchema.omit({
  slug: true,
  type: true,
  mode: true,
  status: true,
  guest: true,
  closedAt: true
})

export type SessionSettings = z.infer<typeof sessionSettings>
export type SessionCardMetadata = z.infer<typeof sessionCardMetadata>
export type SessionCard = z.infer<typeof sessionCard>
export type SessionStats = z.infer<typeof sessionStatsSchema>

export type ClientSessionCard = z.infer<typeof clientSessionCard>

export type BaseClientSession = z.infer<typeof baseClientSessionSchema>
export type SingleClientSession = z.infer<typeof singleClientSessionSchema>
export type MultiClientSession = z.infer<typeof multiClientSessionSchema>
export type ClientSession = z.infer<typeof clientSessionSchema>
export type OfflineClientSession = z.infer<typeof offlineClientSessionSchema>
