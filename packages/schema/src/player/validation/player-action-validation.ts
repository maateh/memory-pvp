import { z } from "zod"

// schemas
import { playerColor, playerTag } from "@repo/schema/player"

export const createPlayerValidation = z.object({
  tag: playerTag,
  color: playerColor
})

export const updatePlayerValidation = z.object({
  previousTag: playerTag,
  tag: playerTag.optional(),
  color: playerColor.optional()
})

export type CreatePlayerValidation = z.infer<typeof createPlayerValidation>
export type UpdatePlayerValidation = z.infer<typeof updatePlayerValidation>
