import { z } from "zod"

// prisma
import { GameMode, GameStatus, GameType, TableSize } from "@prisma/client"

// constants
import { tableSizeMap } from "@/constants/game"

// validations
import { playerColorSchema, playerTagSchema } from "@/lib/validations/player-profile-schema"

/** Local utils */
function sessionCardsRefinement( // FIXME: make it compatible with 'PVP' & 'COOP' modes
  session: Pick<z.infer<typeof clientSessionSchema>, 'tableSize' | 'stats'>,
  ctx: z.RefinementCtx
) {
  const minFlips = tableSizeMap[session.tableSize]

  if ((session.stats?.flips[0] || 0) < minFlips) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Card flips must be at least ${minFlips}`,
      path: ['flips']
    })
  }
}

/** Base schemas */
const cardSchema = z.object({
  id: z.string(),
  key: z.string(),
  imageUrl: z.string().url(),
  isFlipped: z.coerce.boolean(),
  isMatched: z.coerce.boolean()
})

const matchedCardsSchema = z.array(
  cardSchema.merge(
    z.object({
      isFlipped: z.literal(true),
      isMatched: z.literal(true)
    })
  )
)

const sessionPlayerSchema = z.object({
  tag: playerTagSchema,
  color: playerColorSchema,
  user: z.object({
    imageUrl: z.string().nullable().optional()
  })
})

const statsSchema = z.object({
  timer: z.coerce.number(),
  flips: z.record(
    z.string(), z.coerce.number()
  )
})

export const clientSessionSchema = z.object({
  sessionId: z.string().uuid(),

  type: z.nativeEnum(GameType),
  mode: z.nativeEnum(GameMode),
  tableSize: z.nativeEnum(TableSize),

  status: z.nativeEnum(GameStatus),

  players: z.object({
    current: sessionPlayerSchema,
    other: sessionPlayerSchema.nullable().optional()
  }),
  stats: statsSchema,

  flippedCards: z.array(cardSchema),
  cards: z.array(cardSchema),

  startedAt: z.coerce.date(),
  continuedAt: z.coerce.date().optional().nullable()
})

/** Forms / API validations */
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
}).omit({ type: true, mode: true, status: true, players: true })
  .superRefine(sessionCardsRefinement)
