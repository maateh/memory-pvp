import { z } from "zod"

/** Base schemas */
export const playerTagSchema = z.string()
  .min(4, { message: 'Too short.' })
  .max(16, { message: 'Too long.' })

export const playerColorSchema = z.string()
  .length(7, { message: 'Color must be a valid HEX color. e.g. #f1f1f1' })
  .regex(/^#/, { message: 'Color must be a valid HEX color. e.g. #f1f1f1' })

/** Forms / API validations */
export const playerProfileCreateSchema = z.object({
  playerTag: playerTagSchema,
  color: playerColorSchema
})

export const playerProfileUpdateSchema = z.object({
  previousTag: playerTagSchema,
  tag: playerTagSchema.optional(),
  color: playerColorSchema.optional()
})
