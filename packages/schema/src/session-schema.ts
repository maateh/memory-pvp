import { z } from "zod"

// db
import { GameModeSchema, GameStatusSchema, GameTypeSchema, TableSizeSchema } from "@repo/db/zod"

// validations
import { clientPlayerSchema } from "./player-schema"

/* Base schemas */
export const sessionSettings = z.object({
  type: GameTypeSchema,
  mode: GameModeSchema,
  tableSize: TableSizeSchema,
  collectionId: z.string()
})

export const sessionCardMetadataSchema = z.object({
  id: z.string(),
  key: z.coerce.number()
})

export const sessionCardSchema = sessionCardMetadataSchema.extend({
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
export const clientSessionCardSchema = sessionCardSchema.extend({
  imageUrl: z.string()
})

export const clientSessionSchema = z.object({
  slug: z.string(),
  collectionId: z.string(),
  status: GameStatusSchema,
  type: sessionSettings.shape.type,
  mode: sessionSettings.shape.mode,
  tableSize: sessionSettings.shape.tableSize,

  players: z.object({
    current: clientPlayerSchema,
    other: clientPlayerSchema.nullable().optional()
  }),
  stats: sessionStatsSchema,

  cards: z.array(clientSessionCardSchema),
  flipped: z.array(sessionCardMetadataSchema),

  startedAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  continuedAt: z.coerce.date().optional().nullable(),
  closedAt: z.coerce.date().optional().nullable()
})

export const unsignedClientSessionSchema = clientSessionSchema.omit({
  slug: true,
  type: true,
  mode: true,
  status: true,
  closedAt: true
})

export type SessionSettings = z.infer<typeof sessionSettings>
export type SessionCardMetadata = z.infer<typeof sessionCardMetadataSchema>
export type SessionCard = z.infer<typeof sessionCardSchema>
export type SessionStats = z.infer<typeof sessionStatsSchema>
export type ClientSessionCard = z.infer<typeof clientSessionCardSchema>
export type ClientGameSession = z.infer<typeof clientSessionSchema>
export type UnsignedClientGameSession = z.infer<typeof unsignedClientSessionSchema>
