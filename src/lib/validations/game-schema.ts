import { z } from "zod"

// prisma
import { GameMode, GameStatus, GameType, TableSize } from "@prisma/client"

// constants
import { tableSizeMap } from "@/constants/game"

export const cardSchema = z.object({
  id: z.string(),
  key: z.string(),
  imageUrl: z.string().url(),
  isFlipped: z.coerce.boolean(),
  isMatched: z.coerce.boolean()
})

/** Forms / API validations */
export const setupGameSchema = z.object({
  type: z.nativeEnum(GameType),
  mode: z.nativeEnum(GameMode),
  tableSize: z.nativeEnum(TableSize)
})

export const updateGameStatusSchema = z.enum([GameStatus.ABANDONED, GameStatus.FINISHED])

export const saveOfflineGameSchema = z.object({
  playerTag: z.string(),
  tableSize: z.nativeEnum(TableSize),
  startedAt: z.coerce.date(),
  timer: z.coerce.number(),
  flips: z.coerce.number(),
  cards: z.array(
    cardSchema.merge(
      z.object({
        isFlipped: z.literal(true),
        isMatched: z.literal(true)
      })
    )
  )
}).superRefine((data, ctx) => {
  const minFlips = tableSizeMap[data.tableSize]
  if (data.flips < minFlips) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Card flips must be at least ${minFlips}`,
      path: ['flips']
    })
  }
})
