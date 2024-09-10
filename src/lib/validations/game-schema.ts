import { z } from "zod"

// prisma
import { GameMode, GameStatus, GameType, TableSize } from "@prisma/client"

export const startGameSchema = z.object({
  type: z.nativeEnum(GameType),
  mode: z.nativeEnum(GameMode),
  tableSize: z.nativeEnum(TableSize)
})

export const updateGameStatusSchema = z.enum([GameStatus.ABANDONED, GameStatus.FINISHED])

export const saveOfflineGameSchema = z.object({
  playerTag: z.string(),
  tableSize: z.nativeEnum(TableSize),
  startedAt: z.coerce.date()
})
