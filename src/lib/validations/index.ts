import { z } from "zod"

export const playerProfileCreateSchema = z.object({
  playerTag: z.string()
    .min(4, { message: 'Too short.' })
    .max(16, { message: 'Too long.' }),
  color: z.string()
    .length(7, { message: 'Color must be a valid HEX color. e.g. #f1f1f1' })
    .regex(/^#/, { message: 'Color must be a valid HEX color. e.g. #f1f1f1' })
})

export const playerProfileUpdateSchema = playerProfileCreateSchema.extend({
  id: z.string()
})
