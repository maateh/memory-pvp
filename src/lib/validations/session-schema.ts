import { z } from "zod"

// prisma
import { GameMode, GameStatus, GameType, TableSize } from "@prisma/client"

// validations
import { clientPlayerSchema } from "@/lib/validations/player-schema"

/** Base schemas */
const cardIdentifierSchema = z.object({
  id: z.string(),
  key: z.string()
})

const cardSchema = cardIdentifierSchema.extend({
  imageUrl: z.string().url(),
  flippedBy: z.string().nullable(),
  matchedBy: z.string().nullable()
})

const matchedCardsSchema = z.array(
  cardSchema.merge(
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

  type: z.nativeEnum(GameType),
  mode: z.nativeEnum(GameMode),
  tableSize: z.nativeEnum(TableSize),

  status: z.nativeEnum(GameStatus),

  players: z.object({
    current: clientPlayerSchema,
    other: clientPlayerSchema.nullable().optional()
  }),
  stats: sessionStatsSchema,

  cards: z.array(cardSchema),
  flipped: z.array(cardIdentifierSchema),

  startedAt: z.coerce.date(),
  continuedAt: z.coerce.date().optional().nullable()
})

/** Forms / API validations */
export const sessionFilterSchema = clientSessionSchema
  .partial()
  .omit({
    cards: true,
    flipped: true
  }).optional().default({})

export const setupGameSchema = z.object({
  type: z.nativeEnum(GameType),
  mode: z.nativeEnum(GameMode),
  tableSize: z.nativeEnum(TableSize)
})

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
