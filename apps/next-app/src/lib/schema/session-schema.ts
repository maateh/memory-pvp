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
  flippedBy: z.string().nullable(), // TODO: remove `flippedBy` -> track flipped cards only inside the `flipped` array
  matchedBy: z.string().nullable()
})

export const matchedCardSchema = sessionCardMetadataSchema.extend({
  flippedBy: z.string().nullable(), // TODO: remove `flippedBy` -> track flipped cards only inside the `flipped` array
  matchedBy: z.string()
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
  status: z.nativeEnum(GameStatus),
  type: z.nativeEnum(GameType),
  mode: z.nativeEnum(GameMode),
  tableSize: z.nativeEnum(TableSize),

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
