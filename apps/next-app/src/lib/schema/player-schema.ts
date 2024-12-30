import { z } from "zod"

/* Base schemas */
export const playerTagSchema = z.string()
  .min(4, { message: 'Too short.' })
  .max(16, { message: 'Too long.' })

export const playerColorSchema = z.string()
  .length(7, { message: 'Color must be a valid HEX color. e.g. #f1f1f1' })
  .regex(/^#/, { message: 'Color must be a valid HEX color. e.g. #f1f1f1' })

export const playerStatsSchema = z.object({
  score: z.coerce.number(),
  timer: z.coerce.number(),
  flips: z.coerce.number(),
  matches: z.coerce.number(),
  sessions: z.coerce.number()
})

/* Client base schemas */
export const clientPlayerSchema = z.object({
  id: z.string(),
  tag: playerTagSchema,
  color: playerColorSchema,
  isActive: z.coerce.boolean(),
  imageUrl: z.string().nullable().optional(),
  stats: playerStatsSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
})
