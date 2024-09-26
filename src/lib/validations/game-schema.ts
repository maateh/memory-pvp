import { z } from "zod"

// prisma
import { GameMode, GameStatus, GameType, TableSize } from "@prisma/client"

// constants
import { tableSizeMap } from "@/constants/game"

/** Local utils */
const sessionCardsRefinement = (data: z.infer<typeof clientSessionSchema>, ctx: z.RefinementCtx) => {
  const minFlips = tableSizeMap[data.tableSize]
  if (data.flips < minFlips) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Card flips must be at least ${minFlips}`,
      path: ['flips']
    })
  }
}

/** Base schemas */
export const cardSchema = z.object({
  id: z.string(),
  key: z.string(),
  imageUrl: z.string().url(),
  isFlipped: z.coerce.boolean(),
  isMatched: z.coerce.boolean()
})

export const clientSessionSchema = z.object({
  type: z.nativeEnum(GameType),
  mode: z.nativeEnum(GameMode),
  tableSize: z.nativeEnum(TableSize),
  status: z.nativeEnum(GameStatus),
  startedAt: z.coerce.date(),
  continuedAt: z.coerce.date().optional().nullable(),
  timer: z.coerce.number(),
  flips: z.coerce.number(),
  flippedCards: z.array(cardSchema),
  cards: z.array(cardSchema)
})

/** Forms / API validations */
export const setupGameSchema = z.object({
  type: z.nativeEnum(GameType),
  mode: z.nativeEnum(GameMode),
  tableSize: z.nativeEnum(TableSize)
})

export const updateGameStatusSchema = z.enum([GameStatus.ABANDONED, GameStatus.FINISHED])

export const saveOfflineGameSchema = clientSessionSchema.extend({
  playerTag: z.string(),
  type: z.literal(GameType.CASUAL),
  mode: z.literal(GameMode.SINGLE),
  status: z.literal(GameStatus.OFFLINE),
  cards: z.array(
    cardSchema.merge(
      z.object({
        isFlipped: z.literal(true),
        isMatched: z.literal(true)
      })
    )
  )
}).superRefine(sessionCardsRefinement)
