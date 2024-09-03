import { z } from "zod"

const playerTagSchema = z.string()
  .min(4, { message: 'Too short.' })
  .max(16, { message: 'Too long.' })

const playerColorSchema = z.string()
  .length(7, { message: 'Color must be a valid HEX color. e.g. #f1f1f1' })
  .regex(/^#/, { message: 'Color must be a valid HEX color. e.g. #f1f1f1' })

export const playerProfileCreateSchema = z.object({
  playerTag: playerTagSchema,
  color: playerColorSchema
})

export const playerProfileUpdateSchema = z.object({
  playerId: z.string(),
  playerTag: playerTagSchema.optional(),
  color: playerColorSchema.optional()
})
