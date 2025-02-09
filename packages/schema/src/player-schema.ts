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

export const roomPlayerStatus = z.enum(["online", "offline"])

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

export const roomPlayerSchema = clientPlayerSchema.extend({ // TODO: must be replaced by db schema
  status: roomPlayerStatus,
  socketId: z.string().nullable(),
  ready: z.coerce.boolean()
})

export type PlayerTag = z.infer<typeof playerTagSchema>
export type PlayerColor = z.infer<typeof playerColorSchema>
export type PlayerStats = z.infer<typeof playerStatsSchema>
export type RoomPlayerStatus = z.infer<typeof roomPlayerStatus>
export type ClientPlayer = z.infer<typeof clientPlayerSchema>
export type RoomPlayer = z.infer<typeof roomPlayerSchema>
