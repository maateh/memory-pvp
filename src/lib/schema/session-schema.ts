import { z } from "zod"

// prisma
import { GameMode, GameStatus, GameType, TableSize } from "@prisma/client"

// validations
import { clientPlayerSchema } from "@/lib/schema/player-schema"

/* Base schemas */
export const sessionCardMetadataSchema = z.object({
  id: z.string(),
  key: z.coerce.number()
})

export const sessionCardSchema = sessionCardMetadataSchema.extend({
  flippedBy: z.string().nullable(),
  matchedBy: z.string().nullable()
})

export const matchedCardsSchema = z.array(
  sessionCardSchema.merge(
    z.object({
      matchedBy: z.string()
    })
  )
)

export const sessionStatsSchema = z.object({
  timer: z.coerce.number(),
  flips: z.record(
    z.string(), z.coerce.number()
  ),
  matches: z.record(
    z.string(), z.coerce.number()
  )
})

export const clientSessionSchema = z.object({
  slug: z.string(),
  collectionId: z.string(),

  type: z.nativeEnum(GameType),
  mode: z.nativeEnum(GameMode),
  tableSize: z.nativeEnum(TableSize),

  status: z.nativeEnum(GameStatus),

  players: z.object({
    current: clientPlayerSchema,
    other: clientPlayerSchema.nullable().optional()
  }),
  stats: sessionStatsSchema,

  cards: z.array(sessionCardSchema),
  flipped: z.array(sessionCardMetadataSchema),

  startedAt: z.coerce.date(),
  continuedAt: z.coerce.date().optional().nullable(),
  closedAt: z.coerce.date().optional().nullable()
})
