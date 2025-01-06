import { z } from "zod"

// schemas
import { playerColorSchema, playerTagSchema } from "@/lib/schema/player-schema"

/* Form / API validations */
export const createPlayerSchema = z.object({
  tag: playerTagSchema,
  color: playerColorSchema
})

export const updatePlayerSchema = z.object({
  previousTag: playerTagSchema,
  tag: playerTagSchema.optional(),
  color: playerColorSchema.optional()
})

export type CreatePlayerValidation = z.infer<typeof createPlayerSchema>
export type UpdatePlayerValidation = z.infer<typeof updatePlayerSchema>
