import { z } from "zod"

// prisma
import { GameMode, GameStatus, GameType, TableSize } from "@prisma/client"

// validations
import { clientPlayerSchema, playerTagSchema } from "@/lib/validations/player-schema"

/** Base schemas */
const sessionCardMetadataSchema = z.object({
  id: z.string(),
  key: z.coerce.number()
})

const sessionCardSchema = sessionCardMetadataSchema.extend({
  flippedBy: z.string().nullable(),
  matchedBy: z.string().nullable()
})

const matchedCardsSchema = z.array(
  sessionCardSchema.merge(
    z.object({
      matchedBy: z.string()
    })
  )
)

const sessionStatsSchema = z.object({
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
  continuedAt: z.coerce.date().optional().nullable()
})

/** Query filters */
export const sessionFilterSchema = clientSessionSchema
  .extend({ playerTag: playerTagSchema })
  .partial()
  .omit({
    stats: true,
    cards: true,
    flipped: true,
    players: true
  }).optional().default({})

const sortKeys = z.enum(['asc', 'desc']).optional()
export const sessionSortSchema = z.object({
  type: sortKeys,
  mode: sortKeys,
  tableSize: sortKeys,
  status: sortKeys,
  startedAt: sortKeys,
  continuedAt: sortKeys
}).optional().default({})

export const getSessionsSchema = z.object({
  filter: sessionFilterSchema,
  sort: sessionSortSchema
}).optional().default({})

/** Forms / API validations */
export const createSessionSchema = clientSessionSchema.pick({
  type: true,
  mode: true,
  tableSize: true
}).extend({ collectionId: z.string().optional() })

export const saveSessionSchema = clientSessionSchema.omit({ players: true })

export const finishSessionSchema = clientSessionSchema.extend({
  cards: matchedCardsSchema
}).omit({ status: true, players: true })

export const abandonSessionSchema = clientSessionSchema
  .omit({ status: true, players: true })
  .optional()

export const saveOfflineGameSchema = clientSessionSchema.extend({
  playerTag: z.string(),
  cards: matchedCardsSchema
}).omit({ slug: true, type: true, mode: true, status: true, players: true })
