import { z } from "zod"

// schemas
import { playerColorSchema, playerTagSchema } from "@repo/schema/player"

/* Form / API validations */
export const createPlayerValidation = z.object({
  tag: playerTagSchema,
  color: playerColorSchema
})

export const updatePlayerValidation = z.object({
  previousTag: playerTagSchema,
  tag: playerTagSchema.optional(),
  color: playerColorSchema.optional()
})

export type CreatePlayerValidation = z.infer<typeof createPlayerValidation>
export type UpdatePlayerValidation = z.infer<typeof updatePlayerValidation>
