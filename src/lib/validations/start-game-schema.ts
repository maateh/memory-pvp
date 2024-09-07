import { z } from "zod"

// prisma
import { GameMode, GameType, TableSize } from "@prisma/client"

export const startGameSchema = z.object({
  type: z.nativeEnum(GameType),
  mode: z.nativeEnum(GameMode),
  tableSize: z.nativeEnum(TableSize)
})
