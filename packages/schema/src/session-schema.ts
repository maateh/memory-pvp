import { z } from "zod"

// prisma
import { GameMode, GameStatus, GameType, TableSize } from "@repo/db"

// validations
import { clientPlayerSchema } from "./player-schema"

/* Base schemas */
export const sessionStatus = z.nativeEnum(GameStatus)
export const sessionType = z.nativeEnum(GameType)
export const sessionMode = z.nativeEnum(GameMode)
export const sessionTableSize = z.nativeEnum(TableSize)

export const sessionCardMetadataSchema = z.object({
  id: z.string(),
  key: z.coerce.number()
})

export const sessionCardSchema = sessionCardMetadataSchema.extend({
  flippedBy: z.string().nullable(), // TODO: remove `flippedBy` -> track flipped cards only inside the `flipped` array
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
  status: sessionStatus,
  type: sessionType,
  mode: sessionMode,
  tableSize: sessionTableSize,

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

export type SessionCardMetadata = z.infer<typeof sessionCardMetadataSchema>
export type SessionCard = z.infer<typeof sessionCardSchema>
export type SessionStats = z.infer<typeof sessionStatsSchema>
export type ClientSessionCard = z.infer<typeof clientSessionCardSchema>
export type ClientGameSession = z.infer<typeof clientSessionSchema>
