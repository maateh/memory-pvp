import { z } from "zod"

/** Base schemas */
export const playerTagSchema = z.string()
  .min(4, { message: 'Too short.' })
  .max(16, { message: 'Too long.' })

export const playerColorSchema = z.string()
  .length(7, { message: 'Color must be a valid HEX color. e.g. #f1f1f1' })
  .regex(/^#/, { message: 'Color must be a valid HEX color. e.g. #f1f1f1' })

const playerStatsSchema = z.object({
  score: z.coerce.number(),
  timer: z.coerce.number(),
  flips: z.coerce.number(),
  matches: z.coerce.number(),
  sessions: z.coerce.number()
})

export const clientPlayerSchema = z.object({
  tag: playerTagSchema,
  color: playerColorSchema,
  isActive: z.coerce.boolean(),
  imageUrl: z.string().nullable().optional(),
  stats: playerStatsSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional().nullable()
})

/* Query filters */
export const playerFilterSchema = z.object({
  tag: z.string()
}).partial().optional().default({})

const sortKeys = z.enum(['asc', 'desc']).optional()
export const playerSortSchema = z.object({
  tag: sortKeys,
  createdAt: sortKeys
}).optional().default({})

export const getPlayersSchema = z.object({
  filter: playerFilterSchema.optional(),
  sort: playerSortSchema.optional()
}).optional().default({})

/** Forms / API validations */
export const createPlayerSchema = z.object({
  tag: playerTagSchema,
  color: playerColorSchema
})

export const updatePlayerSchema = z.object({
  previousTag: playerTagSchema,
  tag: playerTagSchema.optional(),
  color: playerColorSchema.optional()
})
